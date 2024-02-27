export default class ObjectUtil {
    static isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (ObjectUtil.isObject(target) && ObjectUtil.isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (ObjectUtil.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    ObjectUtil.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            });
        }

        return ObjectUtil.mergeDeep(target, ...sources);
    }
}