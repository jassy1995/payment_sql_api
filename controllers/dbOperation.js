const db = require("../util/database");

const Operation = function () {
  this.updateByPhone = async function (phoneNumber, stage) {
    this.phoneNumber = phoneNumber;
    this.stage = stage;
    const sql = "UPDATE users_tb SET stage = ? WHERE users_tb.phone  = ?";
    await db.execute(sql, [this.phoneNumber, this.stage]);
  };
  this.findByPhone = async function (phoneNumber) {
    this.phoneNumber = phoneNumber;
    const sql = "SELECT * FROM users_tb WHERE users_tb.phone = ?";
    const [user, others] = await db.execute(sql, [this.phoneNumber]);
    return user;
  };

  this.createUser = async function (data) {
    this.data = data;
    const sql =
      "INSERT INTO users_tb (phone,stage,qty,amount,payment_key,merchant_name,account_no,bank) VALUES (?,?,?,?,?,?,?,?)";
    await db.execute(sql, this.data);
  };

  this.updateByPhone2 = async function (phoneNumber, qty, stage) {
    this.phoneNumber = phoneNumber;
    this.qty = qty;
    this.stage = stage;
    const sql =
      "UPDATE users_tb SET qty = ?, stage = ? WHERE users_tb.phone = ?";
    await db.execute(sql, [this.qty, this.stage, this.phoneNumber]);
  };

  this.updateByPhone3 = async function (phoneNumber, amount, stage) {
    this.phoneNumber = phoneNumber;
    this.amount = amount;
    this.stage = stage;
    const sql =
      "UPDATE users_tb SET amount = ?, stage = ? WHERE users_tb.phone = ?";
    await db.execute(sql, [this.amount, this.stage, this.phoneNumber]);
  };

  this.updateByPhone4 = async function (phoneNumber, info) {
    this.phoneNumber = phoneNumber;
    this.info = info;
    const sql =
      "UPDATE users_tb SET  stage = ?, amount = ?, merchant_name = ? WHERE users_tb.phone = ?";
    await db.execute(sql, [
      this.info[0],
      this.info[1],
      this.info[2],
      this.phoneNumber,
    ]);
  };

  this.updateByPhone6 = async function (phoneNumber, val) {
    this.phoneNumber = phoneNumber;
    this.val = val;
    const sql =
      "UPDATE users_tb SET  stage = ?, payment_key = ?, account_no = ?, bank = ? WHERE users_tb.phone = ?";
    await db.execute(sql, [
      this.val[0],
      this.val[1],
      this.val[2],
      this.val[3],
      this.phoneNumber,
    ]);
  };

  this.updateByPhone7 = async function (phoneNumber, stage) {
    this.phoneNumber = phoneNumber;
    this.stage = stage;
    const sql = "UPDATE users_tb SET  stage = ? WHERE users_tb.phone = ?";
    await db.execute(sql, [this.stage, this.phoneNumber]);
  };
};
module.exports = Operation;
