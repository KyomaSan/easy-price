/**
 * 易手游，将获得的五星角色和五星武器先转为正常名字，再根据定价规则计算为多少钱
 * @param info - 五星角色和武器的信息 *
 * @param arr - 五星角色和武器的定价规则
 * @returns     总价
 */
import { toRaw } from "vue";
export function handleYiShouYou(value, arr) {
    let info = toRaw(value);
    // 替换特定名称
    const replaceNames = (obj) => {
        if (obj.name === "五星角色") {
            obj.value = Object.fromEntries(Object.entries(obj.value).map(([key, value]) => [key === "护法夜叉·魈" ? "魈" : key, value]));
        } else if (obj.name === "五星武器") {
            obj.value = Object.fromEntries(Object.entries(obj.value).map(([key, value]) => [key === "弓·若水" ? "若水" : key, value]));
        }
    };

    // 替换info中的角色和武器名称
    info.forEach(replaceNames);
    const roleInfo = info.find((item) => item.name === "五星角色").value;
    const weaponInfo = info.find((item) => item.name === "五星武器").value;
    let totalPrice = 0;
    let details = [];
    for (const [roleName, roleLevel] of Object.entries(roleInfo)) {
        // 获取该角色的所有配置
        const roleConfigs = arr.find((configArr) => configArr[0].角色 === roleName);
        if (roleConfigs) {
            // 检查是否有匹配的武器
            let foundWeapon = false;
            for (const [weaponName, weaponLevel] of Object.entries(weaponInfo)) {
                if (weaponLevel !== "0") {
                    // 如果武器等级不为0，表示该武器可用
                    const weaponConfig = roleConfigs.find(
                        (config) => config.命座 === parseInt(roleLevel) && config.武器 === `精${weaponLevel}${weaponName}`
                    );
                    if (weaponConfig) {
                        totalPrice += weaponConfig.价格;
                        details.push(`${roleName}${roleLevel}命+${weaponConfig.武器}=${weaponConfig.价格}`);
                        foundWeapon = true;
                        break; // 找到匹配的武器后就跳出循环
                    }
                }
            }
            // 如果没有找到匹配的武器，则使用无专的价格
            if (!foundWeapon) {
                const noWeaponConfig = roleConfigs.find((config) => config.命座 === parseInt(roleLevel) && config.武器 === "无专");
                if (noWeaponConfig) {
                    totalPrice += noWeaponConfig.价格;
                    details.push(`${roleName}${roleLevel}命+无专=${noWeaponConfig.价格}`);
                }
            }
        }
    }

    // 按照价格从高到低排序
    details.sort((a, b) => {
        const priceA = parseInt(a.split("=")[1]);
        const priceB = parseInt(b.split("=")[1]);
        return priceB - priceA;
    });

    // 添加总价
    details.push(`合计${totalPrice}`);

    return details.join("\n");
}

/* 
// 不会排序的版本
export function handleYiShouYou(value, arr) {
    let info = toRaw(value);
    // 替换特定名称
    const replaceNames = (obj) => {
        if (obj.name === "五星角色") {
            obj.value = Object.fromEntries(Object.entries(obj.value).map(([key, value]) => [key === "护法夜叉·魈" ? "魈" : key, value]));
        } else if (obj.name === "五星武器") {
            obj.value = Object.fromEntries(Object.entries(obj.value).map(([key, value]) => [key === "弓·若水" ? "若水" : key, value]));
        }
    };

    // 替换info中的角色和武器名称
    info.forEach(replaceNames);
    const roleInfo = info.find((item) => item.name === "五星角色").value;
    const weaponInfo = info.find((item) => item.name === "五星武器").value;
    let totalPrice = 0;
    let details = [];
    for (const [roleName, roleLevel] of Object.entries(roleInfo)) {
        // 获取该角色的所有配置
        const roleConfigs = arr.find((configArr) => configArr[0].角色 === roleName);
        if (roleConfigs) {
            // 检查是否有匹配的武器
            let foundWeapon = false;
            for (const [weaponName, weaponLevel] of Object.entries(weaponInfo)) {
                if (weaponLevel !== "0") {
                    // 如果武器等级不为0，表示该武器可用
                    const weaponConfig = roleConfigs.find(
                        (config) => config.命座 === parseInt(roleLevel) && config.武器 === `精${weaponLevel}${weaponName}`
                    );
                    if (weaponConfig) {
                        totalPrice += weaponConfig.价格;
                        details.push(`${roleName}${roleLevel}命+${weaponConfig.武器}=${weaponConfig.价格}`);
                        foundWeapon = true;
                        break; // 找到匹配的武器后就跳出循环
                    }
                }
            }
            // 如果没有找到匹配的武器，则使用无专的价格
            if (!foundWeapon) {
                const noWeaponConfig = roleConfigs.find((config) => config.命座 === parseInt(roleLevel) && config.武器 === "无专");
                if (noWeaponConfig) {
                    totalPrice += noWeaponConfig.价格;
                    details.push(`${roleName}${roleLevel}命+无专=${noWeaponConfig.价格}`);
                }
            }
        }
    }

    // 输出详细信息和总价
    details.push(`合计${totalPrice}`);
    // console.log(details.join("\n"));

    return details.join("\n");
}

*/
