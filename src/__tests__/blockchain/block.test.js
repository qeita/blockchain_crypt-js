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