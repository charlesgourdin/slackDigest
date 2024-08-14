import slackService from "../slack.service";

export async function getUserInfo(userId: string): Promise<{ name: string, email: string } | undefined> {
    try {
        const userInfo = await slackService.users.info({ user: userId });
        if (userInfo.user && userInfo.user.profile) {
            const name = userInfo.user.profile.real_name ?? '';
            const email = userInfo.user.profile.email ?? '';
            return { name, email };
        }
    } catch (error) {
        console.error(`Error fetching user info for ID ${userId}:`, error);
    }
    return undefined;
}

// Fonction pour remplacer les IDs utilisateur dans le texte par des noms et emails
export async function replaceUserIdsWithNames(str: string) {
    const userIdPattern = /<@([A-Z0-9]+)>/g;
    const placeholderPattern = /=>([A-Z0-9]+)<=/g;

    // Remplace les patterns d'ID utilisateur par un format temporaire
    const placeholderStr = str.replace(userIdPattern, (_, match) => `</ID>=>${match}<=</ID>`);

    // Découpe le texte en segments, puis remplace les IDs par les informations utilisateur
    const result = await Promise.all(placeholderStr.split('</ID>').map(async segment => {
        const match = segment.match(placeholderPattern);
        if (match) {
            const [userId] = match;
            const formattedUserId = userId.split(placeholderPattern)[1];
            const userInfo = await getUserInfo(formattedUserId);
            if (userInfo) {
                return segment.replace(placeholderPattern, userInfo.name);
            }
            return 'ID not found';
        }
        return segment;
    }));

    return result.join('');
}