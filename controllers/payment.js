// const db = require("../util/database");
const Operation = require("./dbOperation");
const account = require("accounting");
const axios = require("axios");
const userOp = new Operation();

exports.payMerchant = async (req, res) => {
  const { response, phoneNumber } = req.body;
  const initUser = await userOp.findByPhone(phoneNumber);
  getPaymentRequest = async () => {
    try {
      const data = await axios.post(
        "https://sellbackend.creditclan.com/parent/index.php/globalrequest/get_payment__order",
        { phone: phoneNumber }
      );
      if (!data.data.status)
        return res.json({
          message: "There are no request payment for this number",
        });
      if (data) {
        let checkUser = await userOp.findByPhone(phoneNumber);
        if (checkUser.length === 0) {
          const newUserData = [
            phoneNumber,
            1,
            1,
            0,
            "pending",
            "pending",
            "pending",
            "pending",
          ];
          await userOp.createUser(newUserData);
        }
        if (data.data.order.length > 1) {
          await userOp.updateByPhone2(phoneNumber, data.data.order.length, 2);
          let ordersValue = "";
          data.data.order.forEach((element, index) => {
            ordersValue += `*[${index + 1}]* ${
              element.description
            } cost ${account.formatMoney(element.amount, "₦")} \n`;
          });
          return res.status(200).json({
            message: `Welcome 😃! This service allows to fulfil a payment to a merchant. \n we found the following order for you, select one to pay for below 👇 \n ${ordersValue}`,
          });
        } else {
          await userOp.updateByPhone3(phoneNumber, data.data.order.amount, 3);
          return res.status(200).json({
            message: `Welcome 😃! This service allows to fulfil a payment to a merchant. \n We have found  payment request for you. \n *amount* ${account.formatMoney(
              data.data.order[0].amount,
              "₦"
            )} 💰 \n *merchant_name* ${
              data.data.order[0].merchant.name
            } \n *desc* ${data.data.order[0].description} \n *picture* ${
              data.data.order[0].picture
            } \n  \n kindly enter 👇 \n *[1]* To Make Payment \n *[2]* To Decline`,
          });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Network issues... kindly try again 😋" });
    }
  };

  getRequestDetail = async () => {
    try {
      const data2 = await axios.post(
        "https://sellbackend.creditclan.com/parent/index.php/globalrequest/get_payment__order",
        { phone: phoneNumber }
      );
      let details = [
        3,
        data2.data.order[Number(response) - 1].amount,
        data2.data.order[Number(response) - 1].merchant.name,
      ];
      await userOp.updateByPhone4(phoneNumber, details);
      // let updateUser6 = await User.findOne({ phone: phoneNumber });
      // updateUser6.stage = 3;
      // updateUser6.amount = data2.data.order[Number(response) - 1].amount;
      // updateUser6.merchant_name =
      //   data2.data.order[Number(response) - 1].merchant.name;
      // await updateUser6.save();
      return res.status(200).json({
        message: `We have found the following  payment request for you. \n *amount* ${account.formatMoney(
          data2.data.order[Number(response) - 1].amount,
          "₦"
        )} 💰 \n *merchant_name* ${
          data2.data.order[Number(response) - 1].merchant.name
        } \n *desc* ${
          data2.data.order[Number(response) - 1].description
        } \n *picture* ${
          data2.data.order[Number(response) - 1].picture
        } \n  \n kindly enter 👇 \n *[1]* To Make Payment \n *[2]* To Decline`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Network issues... kindly try again 😋" });
    }
  };

  rejectRequest = async () => {
    try {
      await userOp.updateByPhone(phoneNumber, 1);
      return res
        .status(200)
        .json({ message: "Your request has rejected successfully ❌" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Network issues... kindly try again 😋" });
    }
  };

  generateAccountDetail = async () => {
    //  let getUserInfo = await User.findOne({ phone: phoneNumber });
    const getUserInfo = await userOp.findByPhone(phoneNumber);
    try {
      const result = await axios.post(
        "https://wema.creditclan.com/generate/account",
        {
          merchant_name: getUserInfo[0]?.merchant_name,
          amount: getUserInfo[0]?.amount,
          narration: "PES 2021",
          phone: phoneNumber,
        }
      );
      if (result) {
        let val = [
          4,
          result.data.data.order_ref,
          result.data.data.account_number,
          result.data.data.bank_name,
        ];
        await userOp.updateByPhone6(phoneNumber, val);
        return res.status(200).json({
          message: `Kindly make a payment of ${account.formatMoney(
            result.data.data.amount,
            "₦"
          )} to the account below 👇 \n *account No*  ${
            result.data.data.account_number
          } \n *bank*  ${
            result.data.data.bank_name
          } \n \n After payment, kindly enter 👇 \n *[1]* to confirm your payment`,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Network issues... kindly try again 😋" });
    }
  };

  verifyPayment = async () => {
    const getUser = await userOp.findByPhone(phoneNumber);
    try {
      const verify_payment = await axios.post(
        "https://wema.creditclan.com/api/v3/wema/verify_transaction",
        {
          merchant_name: getUser[0].merchant_name,
          amount: getUser[0].amount,
          narration: "PES 2021",
          // transaction_reference: getUser[0].payment_key,
          transaction_reference: "CC_kESfRVAdZyWc3qiTnmFxPYUBX8hK7tG4",
        }
      );
      if (verify_payment.data.status) {
        await userOp.updateByPhone7(phoneNumber, 5);
        if (getUser[0].qty > 1) {
          return res.status(200).json({
            message:
              "Thank you, we have received your payment 😃, would you like to pay another payment request ? Enter 👇 \n \n *[1]* Yes \n *[2]* No",
          });
        } else {
          return res.status(200).json({
            message:
              "Thank you, we have received your payment 😃, kindly Enter 👇 \n *#* to go to the main menu",
          });
        }
      } else if (!verify_payment.data.status) {
        try {
          return res.status(200).json({
            message: `We have not received your payment,Kindly make a payment of ${account.formatMoney(
              getUser[0].amount,
              "₦"
            )} to the account below 👇 \n *account No*  ${
              getUser[0].account_no
            } \n *bank*  ${
              getUser[0].bank
            } \n \n After payment enter 👇 \n *[1]* to confirm your payment`,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Network issues... kindly try again 😋",
          });
        }
      }
    } catch (error) {
      return res.status(500).json("Network issues... kindly try again 😋");
    }
  };
  if (response && phoneNumber) {
    if (
      response.toLowerCase() === "payment" &&
      /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(phoneNumber)
    ) {
      const user = await userOp.findByPhone(phoneNumber);
      if (user.length > 0) {
        await userOp.updateByPhone(phoneNumber, 1);
      }
      getPaymentRequest();
    } else if (
      Number(response) > 0 &&
      Number(response) <= initUser[0]?.qty &&
      initUser[0]?.stage === 2
    ) {
      getRequestDetail();
    } else if (Number(response) === 2 && initUser[0]?.stage === 3) {
      rejectRequest();
    } else if (Number(response) === 1 && initUser[0]?.stage === 3) {
      generateAccountDetail();
    } else if (Number(response) === 1 && initUser[0]?.stage === 4) {
      verifyPayment();
    } else if (Number(response) === 1 && initUser[0]?.stage === 5) {
      getPaymentRequest();
    } else if (
      (Number(response) === 2 || response === "#") &&
      initUser[0]?.stage === 5
    ) {
      await userOp.updateByPhone(phoneNumber, 1);
      return res.json({ message: "going to main menu..." });
    } else {
      return res.json({
        message: "invalid value,kindly enter correct one ⚠️",
      });
    }
  } else {
    return res.status(500).json({ message: "both field must be  filled ⚠️" });
  }
};

// exports.createProduct = async (req, res, next) => {
//   try {
//     const { title, price, description, imageUrl } = req.body;
//     const sql =
//       "INSERT INTO product_tb (title,price,description,imageUrl) VALUES (?,?,?,?)";
//     const data = [title, price, description, imageUrl];
//     const savedProduct = await db.execute(sql, data);
//     if (savedProduct) {
//       return res.json({
//         message: "product added successfully",
//         status: true,
//       });
//     } else {
//       return res.json({
//         message: "an error occur, please try again",
//         status: false,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.getAllProduct = async (req, res, next) => {
//   try {
//     const sql = "SELECT * FROM product_tb";
//     [result, others] = await db.execute(sql);
//     if (result) return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.getSingleProduct = async (req, res, next) => {
//   try {
//     const id = req.params.product_id;
//     const sql = "SELECT * FROM product_tb WHERE product_tb.product_id = ?";
//     const [user, others] = await db.execute(sql, [id]);
//     if (user) return res.json({ data: user });
//     else return res.status(200).json({ message: "error occur,try again" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.updateProduct = async (req, res, next) => {
//   const { title, price, description, imageUrl } = req.body;
//   try {
//     const id = req.params.product_id;
//     const sql =
//       "UPDATE product_tb SET title = ?, price = ?, description = ?, imageUrl = ? WHERE product_id = ?";
//     const updatedProduct = await db.execute(sql, [
//       title,
//       price,
//       description,
//       imageUrl,
//       id,
//     ]);
//     if (updatedProduct) return res.json({ data: "updated successful" });
//     else return res.json({ message: "error occur,please try again" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const id = req.params.product_id;
//     const sql = "DELETE FROM product_tb WHERE product_id = ?";
//     const deletedProduct = await db.execute(sql, [id]);
//     if (deletedProduct) return res.json({ message: "product deleted" });
//     else
//       return res.status(200).json({ message: "error occur,please try again" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
