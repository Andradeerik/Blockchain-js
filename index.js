const SHA256 = require('crypto-js/sha256')
class Block {
	constructor(index, data, previousHash = '') {
		this.index = index
		this.date = new Date()
		this.data = data
		this.previousHash = previousHash
		this.hash = this.createdHash()
		this.nonce = 0
	}
	createdHash() {
		return SHA256(
			this.index + this.date + this.data + this.previousHash + this.nonce
		).toString()
	}
	mineBlock(difficulty) {
		while (!this.hash.startsWith(difficulty)) {
			this.nonce++
			this.hash = this.createdHash()
		}
	}
}
// block = new Block(0, 'Hello')
// console.log(JSON.stringify(Block, null, 2))
class Blockchain {
	constructor(genesis, difficulty = '00') {
		this.chain = [this.createFirstBlock(genesis)]
		this.difficulty = difficulty
	}
	createFirstBlock(genesis) {
		return new Block(0, genesis)
	}
	getLastBlock() {
		return this.chain[this.chain.length - 1]
	}
	addBlock(data) {
		let prevBlock = this.getLastBlock()
		let block = new Block(prevBlock.index + 1, data, prevBlock.hash)
		block.mineBlock(this.difficulty)
		console.log(`Minado ${block.hash} con nonce ${block.nonce}`)
		this.chain.push(block)
	}
	isValid() {
		for (let i = 1; i < this.chain.length; i++) {
			let prevBlock = this.chain[i - 1]
			let currentBlock = this.chain[i]
			if (currentBlock.hash !== currentBlock.createdHash()) {
				return false
			}
			if (currentBlock.previousHash !== prevBlock.hash) {
				return false
			}
		}
		return true
	}
}

let danCoint = new Blockchain('Genesis', '000')
danCoint.addBlock('First Block')
danCoint.addBlock('Second Block')
console.log(JSON.stringify(danCoint.chain, null, 2))
console.log(danCoint.isValid())
danCoint.chain[1].data = 'fake date'
console.log(danCoint.isValid())
