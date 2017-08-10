function assemble(literal, params) {
    return new Function(params, "return `"+literal+"`;");
}

const Messages = {
  dual_lang : {
    greeting: "Chào bạn! Hi there!"
  },
  en_US : {
    greeting: "Hello {{first name}}!",
    addphone: "Thank you!",
    checkphone: assemble("Your number is ${phone_number}, Do you want to change your phone number?", "phone_number"),
    checkphone_button_no: "No",
    checkphone_button_change: "Change",
    updatephone: assemble("Thank you, we have updated your new phone number as ${phone_number}", "phone_number")
  },
  vi_VN : {
    greeting: "Chào {{first name}}!",
    addphone: "Cám ơn bạn",
    checkphone: assemble("Số điện thoại của bạn là ${phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?", "phone_number"),
    checkphone_button_no: "Không",
    checkphone_button_change: "Thay đổi",
    updatephone: assemble("Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${phone_number}", "phone_number")
  }
}

module.exports = {Messages}
