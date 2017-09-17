String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
	chr   = this.charCodeAt(i);
	hash  = ((hash << 5) - hash) + chr;
	hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

var isPkey = function(a) {
  try {
	bitcoin.ECPair.fromWIF(a)
	return true
  } catch(err) {
	return false
  }
};

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
};

var warp = function(hook, passphrase, salt, then){
  var master = this;
  var saveWarp = function(res) {
	then(res.private);
  };
  var hook = hook || function(){};
  var callback = callback || function(){ console.log('finished') };
  var params = { 
	"N"        : 18,
	"p"        : 1,
	"r"        : 4,
	"dkLen"    : 16,
	"pbkdf2c"  : 8192
  };
  warpwallet.run({
  passphrase: passphrase,
  salt: salt,
  progress_hook: hook,
  params: params},
  saveWarp);
};

pubKeyByteArrayToAddress = function(byteArray) {
  try {
	var pub = bitcoin.ECPubKey.fromBuffer( byteArray );
	return pub.getAddress().toString()
  } catch(err) {
	return null
  }
}

revertHash = function(s) {
  var newHash = ''
	for (var i = 0; i <=s.length-2; i=i+2) {
	  newHash = ((s.substring(i,i+2)) + newHash);
	}
  return newHash
};

var base58 = (function(alpha) {
  var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
	base = alphabet.length;
  return {
	encode: function(enc) {
	  if(typeof enc!=='number' || enc !== parseInt(enc))
		throw '"encode" only accepts integers.';
	  var encoded = '';
	  while(enc) {
		var remainder = enc % base;
		enc = Math.floor(enc / base);
		encoded = alphabet[remainder].toString() + encoded;        
	  }
	  return encoded;
	},
	decode: function(dec) {
	  if(typeof dec!=='string')
		throw '"decode" only accepts strings.';            
	  var decoded = 0;
	  while(dec) {
		var alphabetPosition = alphabet.indexOf(dec[0]);
		if (alphabetPosition < 0)
		  throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
		var powerOf = dec.length - 1;
		decoded += alphabetPosition * (Math.pow(base, powerOf));
		dec = dec.substring(1);
	  }
	  return decoded;
	}
  };
})();

var remainingSignatures = function(rawTx, tx, txb) {
	var tx = rawTx ? bitcoin.Transaction.fromHex(rawTx) : tx ;
	var txb = txb || bitcoin.TransactionBuilder.fromTransaction(tx); 
	var validInputs = _.map(txb.inputs, function(input, i) {
		var chunks = bitcoin.script.decompile(tx.ins[i].script);
		var redeemscript = chunks[chunks.length - 1] && chunks[chunks.length - 1];
		var type = typeof(redeemscript) == 'object' && bitcoin.script.classifyOutput(redeemscript);
		if (type == 'multisig') {
			try {
				requiredSignatures = bitcoin.script.decompile(redeemscript)[0] - 80 ;
			} catch(err) {}
		} else {
			try {
				requiredSignatures = 1;
			} catch(err) {}
		};
		numberOfSignatures = _.filter(input.signatures, function(signature) { return !!signature }).length
		return requiredSignatures - numberOfSignatures;

	});
	return validInputs
};

var signRawTx = function(rawTx, wif) {
	try {
		var init = remainingSignatures(rawTx);
		var tx = bitcoin.Transaction.fromHex(rawTx)
		var pp = bitcoin.TransactionBuilder.fromTransaction(tx);//
		_.each(pp.inputs, function(a, i){
			if((typeof(a.signType) == "undefined") || (a.signType == "nonstandard")) {
				a.prevOutType = a.scriptType = a.signType = undefined;
			};
		});
		var pkey = bitcoin.ECPair.fromWIF(wif);
		_.each(pp.inputs, function(input, index) {
			var chunks = bitcoin.script.decompile(tx.ins[index].script);
			var redeemscript = chunks[chunks.length - 1] && chunks[chunks.length - 1];
			var type = typeof(redeemscript) == 'object' && bitcoin.script.classifyOutput(redeemscript);
			if (type == 'multisig') {
				try {
					requiredSignatures = bitcoin.script.decompile(redeemscript)[0] - 80 ;
					if (_.filter(input.signatures, function(s) { return s != undefined}).length < requiredSignatures) {
						possibleSigners = _.map(txb.inputs[0].pubKeys, function(a) {return bitcoin.ECPair.fromPublicKeyBuffer(a).getAddress()});
						if (_.any(possibleSigners, function(s) { s == pkey.getAddress()})) {
							pp.sign(index, pkey, type && redeemscript);
						}
					}
				} catch(err) {}
			} else {
				try {
					if (_.filter(input.signatures, function(s) { return s != undefined}).length < 1) {
						var requiredAddress = tx.ins[index].script.length && bitcoin.address.fromOutputScript(tx.ins[index].script);
						var signingAddress = pkey.getAddress();
						if (requiredAddress == signingAddress) {
							pp.sign(index, pkey);
						}
					}
				} catch(err) {
					console.log(err)
				}
			};
		});
		if (_.any(remainingSignatures(null, tx, pp) , function(s) { return s > 0 })) {
			var built = pp.buildIncomplete();
		} else {
			var built = pp.build();
		};
		var raw = built.toHex();
		var remaining = remainingSignatures(raw);
		var done = _.any(_.map(init, function(n, i) {
			return n - remaining[i];
		}), function(z) { return z > 0 });
		return { 
			'hash' : revertHash(built.getHash().toString('hex')) , 
			'raw' : raw,
			'doneAnything' : done,
			'remaining' : remaining
		}
	} catch(err) {
		console.log(err);
	}
};

segwitAddress = function(WIF) {
	var keyPair = bitcoin.ECPair.fromWIF(WIF);

	var pubKey = keyPair.getPublicKeyBuffer()
	var pubKeyHash = bitcoin.crypto.hash160(pubKey)

	var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
	var redeemScriptHash = bitcoin.crypto.hash160(redeemScript)

	var scriptPubKey = bitcoin.script.scriptHash.output.encode(redeemScriptHash)
	var P2SHaddress = bitcoin.address.fromOutputScript(scriptPubKey)

	return {
		keyPair : keyPair,
		pubKey : pubKey,
		redeemScript : redeemScript,
		redeemScriptHash : redeemScriptHash,
		scriptPubKey : scriptPubKey,
		P2SHaddress : P2SHaddress,
	}
};
