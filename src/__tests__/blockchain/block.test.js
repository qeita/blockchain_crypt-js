// @flow

import Blockchain, {Block} from '../../blockchain'

describe('Block', () => {
  let genesis
  beforeEach(() => {
    genesis = Block.genesis()
  })

  it('genesis block', () => {
    expect(genesis.timestamp).toBe(0)
    expect(genesis.prevHash).toBe('0'.repeat(64))
  })

  it('hashは64桁の16進数', () => {
    const block = new Block(new Date(), genesis.hash(), 0, 0, [])
    const hash = block.hash()
    expect(/[0-9a-f]{64}/.test(hash)).toBe(true)
  })

  it('isValid()', () => {
    // 最小 difficultyTarget
    const minDifficultyBlock = new Block(new Date(), genesis.hash(), 0, 0, [])
    expect(minDifficultyBlock.isValid()).toBe(false)

    // 最大 difficultyTarget
    const maxDifficultyBlock = new Block(new Date(), genesis.hash(), 256, 0, [])
    expect(maxDifficultyBlock.isValid()).toBe(true)
  })
})


describe('Blockchain', () => {
  let blockchain
  let newBlock

  beforeEach(() => {
    blockchain = new Blockchain()
    newBlock = new Block(new Date(), blockchain.chain[0].hash(), 256, 0, [])
  })

  it('初期値はgenesis blockのみ', () => {
    expect(blockchain.chain).toHaveLength(1)
    const block = Block.genesis()
    expect(blockchain.chain[0].hash()).toBe(block.hash())
  })

  it('canAddBlock', () => {
    const olderBlock = new Block(-1, blockchain.chain[0].hash(), 256, 0, [])
    expect(blockchain.canAddBlock(olderBlock)).toBe(false)

    const wrongHashBlock = new Block(new Date(), 'xxxx', 256, 0, [])
    expect(blockchain.canAddBlock(wrongHashBlock)).toBe(false)

    const inValidBlock = new Block(new Date(), blockchain.chain[0].hash(), 0, 0, [])
    expect(blockchain.canAddBlock(inValidBlock)).toBe(false)

    expect(blockchain.canAddBlock(newBlock)).toBe(true)
  })

  it('addBlock test', () => {
    const inValidBlock = new Block(new Date(), blockchain.chain[0].hash(), 0, 0, [])
    let result = blockchain.addBlock(inValidBlock)
    expect(result).toBe(false)
    expect(blockchain.chain).toHaveLength(1)

    result = blockchain.addBlock(newBlock)
    expect(result).toBe(true)
    expect(blockchain.chain).toHaveLength(2)
    expect(blockchain.chain[0].hash()).toBe(blockchain.chain[1].prevHash)
  })

  it('lastHash test', () => {
    const genesis = Block.genesis()
    expect(blockchain.lastHash()).toBe(genesis.hash())

    blockchain.addBlock(newBlock)
    expect(blockchain.lastHash()).toBe(newBlock.hash())
  })
})