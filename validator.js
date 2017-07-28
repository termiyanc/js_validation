Validator = {

    //  Определение типов проверяемых значений
    types: {
        symbolic: {
            rule: /^[a-zа-яё]+$/i,
            message: 'Значение должно состоять только из буквенных символов!'
        },
        numeric: {
            rule: /^\d+(\.,)?\d+$/,
            message: 'Значение должно состоять только из цифр!'
        },
        email: {
            rule: /^[\w.+-]+@\w{2,}\.\w{2,}$/,
            message: 'Значение должно быть вида "mail@host.ru"!'
        },
        phone: {
            rule: /^\+\d-\d{2,}-\d{5,}$/,
            message: 'Значение должно быть вида "+7-987-6543210"!'
        }
    },

    //  Определение подсказки
    tooltip: {
        //  Функция создает элемент подсказки
        new: function (message) {
            var tooltip = document.createElement('div');
            tooltip.className = 'validator-tooltip';
            tooltip.innerText = message;
            return tooltip;
        },
        //  Функция добавляет подсказку к полю
        add: function (field, message) {
            if (field.tooltip)
                this.remove(field);
            field.tooltip = this.new(message);
            field.parentNode.insertBefore(field.tooltip, field.nextSibling);
        },
        //  Функция удаляет подсказку у поля
        remove: function (field) {
            if (field.tooltip !== undefined) {
                field.tooltip.parentNode.removeChild(field.tooltip);
                field.tooltip = undefined;
            }
        }
    },

    //  Функция проверяет значения поля
    validateField: function (field) {
        var trimmedValue = field.value.trim();
        //  Работаю с полем, имеющим значение и определение типа значения
        if (trimmedValue.length && field.dataset.validatorValueType) {
            //  Проверяю значение поля, результат проверки записываю в свойство, стилизую поле и добавляю или убираю подсказку
            if (field.valid = this.types[field.dataset.validatorValueType].rule.test(trimmedValue)) {
                removeClass(field, 'validator-invalid');
                addClass(field, 'validator-valid');
                this.tooltip.remove(field);
            } else {
                removeClass(field, 'validator-valid');
                addClass(field, 'validator-invalid');
                this.tooltip.add(field, this.types[field.dataset.validatorValueType].message);
            }
        } else {
            field.valid = null;
            this.tooltip.remove(field);
            removeClass(field, 'validator-valid|validator-invalid');
        }
    }

};

//  Функция добавляет класс элементу
function addClass(el, classname) {
    if (!new RegExp(classname).test(el.className)) {
        el.className += classname;
    }
}

//  Функция удаляет класс элемента
function removeClass(el, classname) {
    var classnameRegExp = new RegExp('(?:^| )(' + classname + ')(?:$| )');
    if (classnameRegExp.test(el.className)) {
        el.className = el.className.replace(classnameRegExp, '');
    }
}

window.onload = function () {
    var i, j;
    //  Работаю со всеми формами
    for (i in document.forms) {
        //  Работаю со всеми полями формы
        for (j in document.forms[i].elements) {
            //  Проверяю правильность ввода при изменении значения
            document.forms[i].elements[j].onchange = function () {
                Validator.validateField(this)
            };
        }
        //  Определяю поведение при отправке формы
        document.forms[i].onsubmit = function () {
            //  Если есть хотя бы одно неправильное поле, не отправляю форму
            for (var i in this.elements) {
                if (this.elements[i].valid === false) {
                    return false;
                }
            }
        }
    }
};