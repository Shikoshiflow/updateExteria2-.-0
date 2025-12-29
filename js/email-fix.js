// JavaScript для обработки формы с помощью EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация EmailJS с вашим ID пользователя
    emailjs.init("3PunwnG65M1Q2yKCq"); // Замените на ваш реальный ключ
    
    const form = document.getElementById('inquiry-form');
    
    // Если формы нет на странице, прекращаем выполнение скрипта, чтобы не было ошибок
    if (!form) return;

    const formStatus = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    
    // Регулярное выражение для email вынесено для оптимизации
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Функция валидации email
    function isValidEmail(email) {
        return emailRegex.test(String(email).toLowerCase());
    }
    
    // Функция валидации телефона (базовая)
    function isValidPhone(phone) {
        return phone.replace(/\D/g, '').length >= 10;
    }
    
    // Функция для отображения статуса
    function showStatus(type, message) {
        formStatus.className = 'status-message ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        formStatus.classList.add('fade-in-up');
        
        // Удаляем класс анимации после завершения
        setTimeout(() => {
            formStatus.classList.remove('fade-in-up');
        }, 500);
    }
    
    // Функция для переключения состояния кнопки
    function toggleButtonState(isLoading) {
        if (isLoading) {
            buttonText.style.opacity = '0';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
        } else {
            buttonText.style.opacity = '1';
            buttonLoader.style.display = 'none';
            submitButton.disabled = false;
        }
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Валидация полей формы
        const name = form.querySelector('#name').value.trim();
        const company = form.querySelector('#company').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const service = form.querySelector('#service').value;
        const message = form.querySelector('#message').value.trim();
        
        if (!name) {
            showStatus('error', 'Пожалуйста, введите ваше имя.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showStatus('error', 'Пожалуйста, введите корректный email адрес.');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showStatus('error', 'Пожалуйста, введите корректный номер телефона.');
            return;
        }
        
        if (!service) {
            showStatus('error', 'Пожалуйста, выберите интересующую вас услугу.');
            return;
        }
        
        if (!message) {
            showStatus('error', 'Пожалуйста, введите ваше сообщение.');
            return;
        }
        
        // Показываем состояние загрузки
        showStatus('loading', 'Отправка заявки...');
        toggleButtonState(true);
        
        // Получаем текущую дату и время с автоматическим определением часового пояса
        const now = new Date();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Автоматически определяем часовой пояс
        
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: userTimeZone
        };
        
        const formattedDate = now.toLocaleDateString('ru-RU', dateOptions);
        
        // Получаем название часового пояса для отображения
        const timeZoneName = now.toLocaleDateString('ru-RU', { 
            timeZoneName: 'short',
            timeZone: userTimeZone
        }).split(' ').pop(); // Получаем только часовой пояс (например, "MSK" или "TRT")
        
        // Создаем объект с параметрами для EmailJS
        const templateParams = {
            to_name: 'Exteria',
            to_email: 'Mansur.malsagov@exteriatrade.com',
            user_name: name,
            user_email: email,
            user_company: company,
            user_phone: phone,
            user_service: service,
            user_message: message,
            reply_to: email,
            submission_date: formattedDate,
            submission_time: now.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: userTimeZone
            }),
            submission_timezone: timeZoneName, // Добавляем информацию о часовом поясе
            submission_timezone_full: userTimeZone, // Полное название (например, "Europe/Istanbul")
            submission_timestamp: now.toISOString() // ISO формат для точности
        };
        
        // Отправляем форму через EmailJS
        emailjs.send(
            'service_raa52sw',  // ID сервиса из EmailJS
            'template_cy8c54u', // ID шаблона из EmailJS
            templateParams
        )
        .then(function(response) {
            console.log('Успешно отправлено!', response);
            showStatus('success', 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            
            // Прокрутка к сообщению об успехе
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function(error) {
            console.error('Ошибка!', error);
            showStatus('error', 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами другим способом.');
        })
        .finally(() => {
            // Возвращаем кнопку в исходное состояние через 2 секунды
            setTimeout(() => {
                toggleButtonState(false);
            }, 2000);
        });
    });
    
    // Улучшенная универсальная маска для телефона с поддержкой разных стран
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Сохраняем позицию курсора
        let cursorPosition = e.target.selectionStart;
        let oldValue = e.target.value;
        
        // Получаем только цифры
        let digits = e.target.value.replace(/\D/g, '');
        
        // Если пользователь удаляет символы и остались только цифры кода страны
        if (oldValue.length > e.target.value.length && digits.length <= 2) {
            e.target.value = '';
            return;
        }
        
        let formatted = '';
        
        // Определяем код страны и применяем соответствующую маску
        if (digits.startsWith('7') && digits.length > 1) {
            // Российский номер +7
            let x = digits.match(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,4})/);
            formatted = '+' + x[1] + (x[2] ? ' (' + x[2] + ')' : '') + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        } else if (digits.startsWith('90') && digits.length > 2) {
            // Турецкий номер +90
            let x = digits.match(/(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})/);
            formatted = '+' + x[1] + (x[2] ? ' (' + x[2] + ')' : '') + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        } else if (digits.startsWith('1') && digits.length > 1) {
            // Американский/Канадский номер +1
            let x = digits.match(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,4})/);
            formatted = '+' + x[1] + (x[2] ? ' (' + x[2] + ')' : '') + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        } else if (digits.length > 0) {
            // Для других стран - универсальный формат
            // Поддерживаем коды до 3 цифр
            let countryCode = '';
            let phoneNumber = '';
            
            if (digits.length <= 3) {
                countryCode = digits;
                formatted = '+' + countryCode;
            } else {
                // Пробуем определить длину кода страны (1-3 цифры)
                if (digits.startsWith('7') || digits.startsWith('1')) {
                    countryCode = digits.substring(0, 1);
                    phoneNumber = digits.substring(1);
                } else if (digits.length > 2) {
                    // Для двузначных кодов
                    countryCode = digits.substring(0, 2);
                    phoneNumber = digits.substring(2);
                }
                
                if (phoneNumber.length > 0) {
                    let x = phoneNumber.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    formatted = '+' + countryCode + (x[1] ? ' (' + x[1] + ')' : '') + (x[2] ? ' ' + x[2] : '') + (x[3] ? '-' + x[3] : '');
                } else {
                    formatted = '+' + countryCode;
                }
            }
        }
        
        e.target.value = formatted;
        
        // Восстанавливаем позицию курсора
        if (cursorPosition && oldValue.length > formatted.length) {
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        }
    });
    
    // Обработка клавиши Backspace для удобного удаления
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
            let cursorPos = e.target.selectionStart;
            let value = e.target.value;
            
            // Если курсор находится после специального символа (пробел, скобка, дефис)
            if (cursorPos > 0 && /[\s\(\)\-]/.test(value[cursorPos - 1])) {
                e.preventDefault();
                
                // Находим позицию предыдущей цифры
                let newPos = cursorPos - 1;
                while (newPos > 0 && /[\s\(\)\-]/.test(value[newPos - 1])) {
                    newPos--;
                }
                
                // Удаляем цифру перед специальными символами
                if (newPos > 0) {
                    let newValue = value.slice(0, newPos - 1) + value.slice(cursorPos);
                    e.target.value = newValue;
                    
                    // Вызываем событие input для переформатирования
                    e.target.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Устанавливаем курсор в правильную позицию
                    setTimeout(() => {
                        e.target.setSelectionRange(newPos - 1, newPos - 1);
                    }, 0);
                }
            }
        }
        
        // Если нажат Ctrl+A или Cmd+A, позволяем выделить весь текст
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            return;
        }
        
        // Если выделен весь текст и нажата любая цифра, очищаем поле
        if (e.target.selectionStart === 0 && 
            e.target.selectionEnd === e.target.value.length && 
            /\d/.test(e.key)) {
            e.target.value = '';
        }
    });
});