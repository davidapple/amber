## What is Amber?
Amber lets you create air gapped bitcoin addresses and transactions with your offline phone.

In order to take full advantage of offline wallet capabilities, we recommended you keep the phone where Amber is installed in airplane mode and never let it go online after you enter a passphrase.

Creating new bitcoin addresses uses the Warpwallet formula:

## Warp Formula
![Warp Formula](https://raw.githubusercontent.com/davidapple/amber/master/images/warpwallet-formula.png)

For your security; you can double check the output address with other applications (for example… [Warpwallet Doublecheck](https://github.com/xorq/warpwallet_doublecheck_page) and [Warpwallet Dismantled](https://github.com/davidapple/warpwallet-dismantled))

You can use the emojis sequence to check that you haven't made a typo (if the emojis sequence is the same, your passphrase is the same)

## To spend:

* Create a raw transaction on an online device, (using coinb.in for example)
* With Amber, log in to your address using your passphrase/salt combination
* After the wallet has been generated, click on Sign Transaction
* The QR code with the signed transaction will show up, you have to scan it with an online device in order to push it to the bitcoin network (using a pushing service like blockchain.info/pushtx, for example).
