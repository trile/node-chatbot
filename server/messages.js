function assemble(literal, params) {
    return new Function(params, 'return `'+literal+'`;');
}

const Messages = {
  dual_lang : {
    setupcustomer_greeting: 'Chào bạn! Hi there!'
  },
  en_US : {
    setupcustomer_greeting: 'Hello {{first name}}!',
    setlocate: 'Thank you! Your preferred language has been set!',

    checkphone: assemble('Your number is ${phone_number}, Do you want to change your phone number?', 'phone_number'),
    checkphone_button_no: 'No',
    checkphone_button_change: 'Change',
    addphone: 'Thank you!',
    updatephone: assemble('Thank you, we have updated your new phone number as ${phone_number}', 'phone_number'),

    appointmentSettingReady: 'Completed set up appointment settings',
    get_appointment_date: 'What day are you looking to book the appointment?',
    get_appointment_part_of_day: 'Which part of day are you looking to book the appointment?',
    get_appointment_time: 'Please pick a time',
    change_appoiment_time: 'Not seeing anything you like?',
    appointment_time_morning: 'Morning',
    appointment_time_afternoon: 'Afternoon',
    appointment_time_evening: 'Evening',
    appointment_confirm: 'Your appointment is scheduled on ${appointment_date} at {appointment_time}',
    appointment_confirm_thanks: 'Thank you! We will contact to confirm your booking soon',
    appointment_button_confirm: 'Confirm',
    appointment_button_rest: 'Reset',
    appointment_button_cancel: 'Cancel'
  },
  
  vi_VN : {
    setupcustomer_greeting: 'Chào {{first name}}!',
    setlocate: 'Cám ơn bạn! Ngôn ngữ của bạn đã được ghi nhớ!',

    checkphone: assemble('Số điện thoại của bạn là ${phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?', 'phone_number'),
    checkphone_button_no: 'Không',
    checkphone_button_change: 'Thay đổi',
    addphone: 'Cám ơn bạn',
    updatephone: assemble('Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${phone_number}', 'phone_number'),

    appointmentSettingReady: 'Đã ghi nhớ thiết lập lịch hẹn',
    get_appointment_date: 'Bạn muốn đặt lịch hẹn vào ngày tháng nào?',
    get_appointment_part_of_day: 'Đặt lịch hẹn trong ngày',
    get_appointment_time: 'Xin vui lòng chọn thời gian',
    change_appoiment_time: 'Thời gian chưa phù hợp với bạn?',
    appointment_time_morning: 'Buổi sáng',
    appointment_time_afternoon: 'Buổi chiều',
    appointment_time_evening: 'Buồi tối',
    appointment_confirm: assemble('Lịch hẹn của bạn sẽ được đặt vào ngày ${appointment_date} lúc ${appointment_time}', 'appointment_date', 'appointment_time'),
    appointment_confirm_thanks: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ để xác nhận lịch hẹn sớm nhất',
    appointment_button_confirm: 'Xác nhận',
    appointment_button_rest: 'Đặt lại',
    appointment_button_cancel: 'Đặt lại'
  }
}

module.exports = {Messages}
