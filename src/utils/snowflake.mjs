const isValid = (snowflake) => {
    if (typeof snowflake !== "string") return false;
    if (!/^\d{1,20}$/.test(snowflake)) return false;
    return true;
};

export {
    isValid,
};