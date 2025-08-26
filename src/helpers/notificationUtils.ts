import { Liquid, Context } from 'liquidjs';

const liquid = new Liquid({
    strictVariables: false
});

const regexVars = /{(?<prm>\w+)}/gm;

/**
 * Параметры из переменных пишутся как {параметр}
 * Параметры из БД пишутся как %параметр%
 */
export const NotificationUtils = {
    /**
     * Заменить параметры в тексте асинхронно
     */
    replaceParams: async (text: string, replacer: (paramName: string) => Promise<string>) => {
        let result = text;
        let start = 0;
        do {
            const p1 = result.indexOf('%', start);
            if (p1 === -1)
                break;
            const p2 = result.indexOf('%', p1 + 1);
            if (p2 === -1)
                break;
            const paramName = result.slice(p1 + 1, p2);
            if (/\s/.test(paramName)) {
                start = p1 + 1;
                continue;
            }
            const value = await replacer(paramName);
            result = result.slice(0, p1) + value + result.slice(p2 + 1);
            // eslint-disable-next-line no-constant-condition
        } while (true);
        return result;
    },

    /**
     * Получить текст уведомления
     */
    getNotifyText: async (template: string, variables: { [k: string]: any }) => {
        // 1. Проверяем что это шаблон liquid
        if (template.includes('{{') || template.includes('{%')) {
            return liquid.render(liquid.parse(template), new Context(variables));
        }

        // 2. Иначе делаем свой разбор
        let result = '';

        /**
         * Поиск переменной без учета регистра
         */
        const getVariable = (varName: string) => {
            const keys = Object.keys(variables).map(it => it.toLowerCase());
            const index = keys.indexOf(varName.toLowerCase());
            return index === -1 ? undefined : Object.values(variables)[index];
        };

        if (variables) {
            // Заменяем в шаблоне переменные
            result = template.replace(regexVars, (_match, _p1, _p2, _p3, groups) => {
                const varName = groups.prm;
                const res = getVariable(varName);
                if (res !== undefined) {
                    return res;
                }
                return _match;
            });
        } else {
            result = template;
        }

        // заменяем в шаблоне переменные из базы
        result = await NotificationUtils.replaceParams(result, async templateName => {
            return templateName;
        });
        return result;
    }
};
