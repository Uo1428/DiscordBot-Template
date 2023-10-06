/**
 * Check whether a moderator can manage the specified member.
 * @param moderator The moderator.
 * @param member The member to manage.
 */

export const manageable = (moderator, member) => {
    if (moderator.id === moderator.guild.ownerId) return true;
    if (member.id === member.guild.ownerId) return false;
    if (moderator.id === member.id) return false;
    return moderator.roles.highest.comparePositionTo(member.roles.highest) > 0;
};

export const resolveStatus = (status) => {
    switch (status) {
        case "online":
            return "Online";
        case "idle":
            return "Idle";
        case "dnd":
            return "Do Not Disturb";
        case "invisible":
            return "Invisible";
        case "offline":
            return "Offline";
        default:
            return status;
    }
};
