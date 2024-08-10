const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const OP_EAS_CONTRACT = "0x4200000000000000000000000000000000000021"

module.exports = buildModule("AttestationModule", (m) => {

  const attestation = m.contract("Attestation", [OP_EAS_CONTRACT]);

  return { attestation };
});