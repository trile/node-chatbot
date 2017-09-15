function assemble(literal, ...params) {
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

    appointmentSettingReady: 'Are you ready to book your appointment?',
    appointment_button_start: 'Get start',
    get_appointment_date: 'What day are you looking to book the appointment?',
    get_appointment_part_of_day: 'Which part of day are you looking to book the appointment?',
    schedule_morning: assemble('Morning: ${open_morning}-${close_morning}', 'open_morning', 'close_morning'),
    schedule_afternoon: assemble('Afternoon: ${open_afternoon}-${close_afternoon}', 'open_afternoon', 'close_afternoon'),
    schedule_evening: assemble('Evening: ${open_evening}-${close_evening}', 'open_evening', 'close_evening'),
    get_appointment_time: 'Please pick a time',
    change_appoiment_time: 'Not seeing anything you like?',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    appointment_verify: assemble('Your appointment will be scheduled on ${appointment_date} at ${appointment_time}', 'appointment_date', 'appointment_time'),
    appointment_confirm_thanks: 'Thank you! We will contact to confirm your booking soon',
    appointment_button_confirm: 'Confirm',
    appointment_button_change: 'Change appointment',
    appointment_button_cancel: 'Cancel',
    appointment_cancel: 'You have cancelled appointment booking process.',

    dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },

  vi_VN : {
    setupcustomer_greeting: 'Chào {{first name}}!',
    setlocate: 'Cám ơn bạn! Ngôn ngữ của bạn đã được ghi nhớ!',

    checkphone: assemble('Số điện thoại của bạn là ${phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?', 'phone_number'),
    checkphone_button_no: 'Không',
    checkphone_button_change: 'Thay đổi',
    addphone: 'Cám ơn bạn',
    updatephone: assemble('Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${phone_number}', 'phone_number'),

    appointmentSettingReady: 'Bạn đã sẵn sàng đặt lịch hẹn chưa?',
    appointment_button_start: 'Bắt đầu',
    get_appointment_date: 'Bạn muốn đặt lịch hẹn vào ngày nào?',
    get_appointment_part_of_day: 'Bạn chọn buổi nào?',
    schedule_morning: assemble('Buổi sáng: ${open_morning}-${close_morning} ', 'open_morning', 'close_morning'),
    schedule_afternoon: assemble('Buổi chiều: ${open_afternoon}-${close_afternoon}', 'open_afternoon', 'close_afternoon'),
    schedule_evening: assemble('Buổi tối: ${open_evening}-${close_evening}', 'open_evening', 'close_evening'),
    get_appointment_time: 'Xin vui lòng chọn thời gian',
    change_appoiment_time: 'Thời gian chưa phù hợp với bạn?',
    morning: 'Buổi sáng',
    afternoon: 'Buổi chiều',
    evening: 'Buồi tối',
    appointment_verify: assemble('Lịch hẹn của bạn sẽ được đặt vào ngày ${appointment_date} lúc ${appointment_time}', 'appointment_date', 'appointment_time'),
    appointment_confirm_thanks: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ để xác nhận lịch hẹn sớm nhất',
    appointment_button_confirm: 'Xác nhận',
    appointment_button_change: 'Đặt lịch lại',
    appointment_button_cancel: 'Huỷ',
    appointment_cancel: "Bạn đã chọn huỷ đặt lịch hẹn.",

    dayOfWeek: ['CN ngày', 'T2 ngày', 'T3 ngày', 'T4 ngày', 'T5 ngày', 'T6 ngày', 'T7 ngày']
  }
}

module.exports = {Messages}
