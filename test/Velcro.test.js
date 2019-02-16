const Velcro = artifacts.require("Velcro.sol");

contract("Velcro", (accounts) => {
  let velcro;

  beforeEach(async () => {
    velcro = await Velcro.new()
  })

  describe("registerWebhook", () => {
    it("Fails to register if already exists", async () => {
      const ipfsHash = "0xabc123"
      const txn = await velcro.registerWebhook(ipfsHash)
      assert.ok(txn.receipt.status)

      let errorThrown = false;
      try {
        await velcro.registerWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Fails if ipfsHash is empty", async () => {
      const ipfsHash = []
      let errorThrown = false;
      try {
        await velcro.registerWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Succeeds", async () => {
      const ipfsHash = "0xdef456"

      const txn = await velcro.registerWebhook(ipfsHash)

      const [ firstLog ] = txn.receipt.logs
      assert.equal(firstLog.event, "Registered")
      const { owner, ipfsHash: argIpfsHash } = firstLog.args
      assert.equal(owner, accounts[0])
      assert.equal(argIpfsHash, ipfsHash)
      assert.equal(await velcro.owner(ipfsHash), accounts[0])
    })
  })
  describe("unregisterWebhook", () => {
    it("Fails to register if does not exist", async () => {
      const ipfsHash = "0xabc123"

      let errorThrown = false;
      try {
        await velcro.unregisterWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Fails if ipfsHash is empty", async () => {
      const ipfsHash = []
      let errorThrown = false;
      try {
        await velcro.unregisterWebhook(ipfsHash)
      } catch (err) {
        errorThrown = true
      }
      assert.isTrue(errorThrown)
    })

    it("Succeeds", async () => {
      const ipfsHash = "0xdef456"

      const registerTxn = await velcro.registerWebhook(ipfsHash)
      const txn = await velcro.unregisterWebhook(ipfsHash)

      const [ firstLog ] = txn.receipt.logs
      assert.equal(firstLog.event, "Unregistered")
      const { owner, ipfsHash: argIpfsHash } = firstLog.args
      assert.equal(owner, accounts[0])
      assert.equal(argIpfsHash, ipfsHash)

      assert.equal(web3.utils.padRight("0x", 40), await velcro.owner(ipfsHash))
    })
  })
})
