
var test = function() {
	try {
		tx1 = "01000000016ff696fe3463805f338285ce91d6d84ef82bb5e29264f8f3ec2fde8620f26b7b000000001976a914ea3955db6d5b25cb6f879d833aee58dac299a29588acffffffff01e0930400000000001976a914ea3955db6d5b25cb6f879d833aee58dac299a29588ac00000000";
		pkey1 = "5JaxtfLpwu2htdswVqTPHLa9sX6CxxFPSbiD3kHh5HfuwA9Xewa";
	
		console.log(signRawTx(tx1, pkey1).raw.length > tx1.length)
	} catch(err) {
		console.log(err);
	}

	try {
		tx2 = "01000000016ff696fe3463805f338285ce91d6d84ef82bb5e29264f8f3ec2fde8620f26b7b000000008b4830450221008e80f37ef54c5e4e0c107517de1798e1cb2c2a0e33e51f32e28d5f55f3b4960802207876eaac35ceb21de95de5a80fb95f0f752d6eca840ab3a12b0996ce2b26899b01410440c2b6e24f0d60447f0f7844df493bfc1a6ff4f162e8f1f7d3410bb900dee53f321a6d6299eb3e6b98d1138605a3d0e710370800fc7716c5dc53b7b2f448b932ffffffff01e0930400000000001976a914ea3955db6d5b25cb6f879d833aee58dac299a29588ac00000000"
		pkey2 = "5JaxtfLpwu2htdswVqTPHLa9sX6CxxFPSbiD3kHh5HfuwA9Xewa"

		console.log(signRawTx(tx2, pkey2).raw.length == tx2.length)
	} catch(err) {
		//console.log(err);
	}
	try {
		tx3 = "01000000015526d0b27270d70c92eec20d12781853dc6354af725e9054c2262dc3d551037d00000000fd1401004730440220408bcdbfb9a5b981d602f5527e154123ff401908e6d0f2f0978a0b92ba2d8ae1022022df7787d5dfc40ef3fcb2d7cb9f201d372ebceeff8418d53d005f1ca7735620014cc952410447bedb9b5378b0ee00e40dc5dd1c94f513d9ba60acecbacd608455bd7cd6bd41db8ea6b38d6ed4cab0f38f228a09361f10a079361c4e021a242a9ce4e7eb13a74104b30eebf9251334b36e353708e29f8b409b8c2f165b71a38798ba26d0ebc5e964199a842f6494716fabad87aff2449629913b56fb269d6a769a137249eb882bd34104e70b81d4b5c7f4c9947ab22d690b05e84cb1a14ecfc1442b1b8056a983b26539bc21323394d82866307dded2e906910b0dbdb201a7058c0b27e0e9aefacd784653aeffffffff01301b0f00000000001976a91405d3984a91e60d677b32145a1b5ad586da50a7ae88ac00000000";
		pkey3 = "5JMTtVLuW1v81dqK15ftgmRY5fSKUAFp1iX94KqN1MdZpYTS5uJ";

		console.log(signRawTx(tx3, pkey3).raw.length > tx3.length)
	} catch(err) {
		console.log(err);
	}

	try {
		tx4 = remainingSignatures('01000000026ff696fe3463805f338285ce91d6d84ef82bb5e29264f8f3ec2fde8620f26b7b000000008a47304402204f7a598d2ab5ef6c23124d9f94c3310200ed6fdf699ef1b90b09071d2d09174302201dd1b732201ab80bafb7f0dfa3bba6a8932d4cadbf70664c0610f53b96b5638701410440c2b6e24f0d60447f0f7844df493bfc1a6ff4f162e8f1f7d3410bb900dee53f321a6d6299eb3e6b98d1138605a3d0e710370800fc7716c5dc53b7b2f448b932fffffffff21f019f492772e0ae3fe9792abe4cbc2e495a9eecbc75044a41affbd16dd54e0000000000ffffffff0147110000000000001976a914ea3955db6d5b25cb6f879d833aee58dac299a29588ac00000000')
		console.log(tx4[0] == 0 && tx4[1] == 1);
	} catch(err) {
		console.log(err);
	}

	try {
		var tx5 = '01000000026ff696fe3463805f338285ce91d6d84ef82bb5e29264f8f3ec2fde8620f26b7b000000001976a914ea3955db6d5b25cb6f879d833aee58dac299a29588acffffffff74ed822fb091f927ef6d45197c361637bd597eefa478bfc6756fcbbfb4cdc9400000000000ffffffff01801a0600000000001976a91405d3984a91e60d677b32145a1b5ad586da50a7ae88ac00000000';
		var pkey = '5JaxtfLpwu2htdswVqTPHLa9sX6CxxFPSbiD3kHh5HfuwA9Xewa';
		var signedTX = signRawTx(tx5, pkey).raw;
		var remainingSigs = remainingSignatures(signedTX);
	} catch(err) {
		console.log(err);
	}
}

test();

