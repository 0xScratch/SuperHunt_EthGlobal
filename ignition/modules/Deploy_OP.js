const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { vars } = require("hardhat/config");

const APP_ID = vars.get("APP_ID");
const ACTION_ID = vars.get("ACTION_ID");
const PYTH_OP_SEPOLIA= '0x0708325268dF9F66270F1401206434524814508b'
const ETH_USD_ID='0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace'

const OP_EAS_CONTRACT = "0x4200000000000000000000000000000000000021"

module.exports = buildModule("Deploy_OP", (m) => {

  const attestation = m.contract("Attestation", [OP_EAS_CONTRACT]);

  const id = m.contract("ID", [APP_ID, ACTION_ID]);

  const superhuntOP = m.contract("SuperHuntOP", [PYTH_OP_SEPOLIA, ETH_USD_ID]);

  return { attestation, id, superhuntOP };
});