function assemble(literal, params) {
    return new Function(params, "return `"+literal+"`;");
}

const Messages = {
  dual_lang : {
    setupcustomer_greeting: "Chào bạn! Hi there!"
  },
  en_US : {
    setupcustomer_greeting: "Hello {{first name}}!",
    setlocate: "Thank you! Your preferred language has been set!",
    checkphone: assemble("Your number is ${phone_number}, Do you want to change your phone number?", "phone_number"),
    checkphone_button_no: "No",
    checkphone_button_change: "Change",
    addphone: "Thank you!",
    updatephone: assemble("Thank you, we have updated your new phone number as ${phone_number}", "phone_number")
  },
  vi_VN : {
    setupcustomer_greeting: "Chào {{first name}}!",
    setlocate: "Cám ơn bạn! Ngôn ngữ của bạn đã được ghi nhớ!",
    checkphone: assemble("Số điện thoại của bạn là ${phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?", "phone_number"),
    checkphone_button_no: "Không",
    checkphone_button_change: "Thay đổi",
    addphone: "Cám ơn bạn",
    updatephone: assemble("Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${phone_number}", "phone_number")
  }
}

module.exports = {Messages}
