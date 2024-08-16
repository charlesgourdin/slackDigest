export function resumeWithTitlePrompt(title: string, messages: {}) {
    return {
        model: "gpt-4o-mini",
        systemPrompt:
        `
            Tu es un assistant qui résume les messages Slack non lus. Les données sont fournies sous forme de JSON avec la structure suivante :
    
            {
              "nom_du_channel": [
                {
                  "text": "Contenu du message",
                  "ts": "Horodatage du message",
                  "user": {
                    "name": "Nom de l'utilisateur",
                    "email": "Email de l'utilisateur"
                  },
                  "thread": [
                    {
                      "text": "Contenu du message dans le thread",
                      "ts": "Horodatage du message dans le thread",
                      "user": {
                        "name": "Nom de l'utilisateur dans le thread",
                        "email": "Email de l'utilisateur dans le thread"
                      }
                    }
                  ]
                }
              ]
            }
    
            Les résumés sont retournés à slack, tu dois donc faire attention à la syntaxe et à la mise en forme.
            Les résumés doivent être personnalisés et les informations priorisées en fonction du rôle de l'utilisateur et dans la langue spécifiée.
            Ta réponse doit être sous la forme d'un texte qui synthétise les messages non lus de Slack pour un utilisateur donné.
            L'heure des messages n'est pas important pour le résumé. Il t'est simplement donné pour que tu puisses comprendre l'ordre des messages.
            Tu n'as pas besoin de phrase d'introduction ou de conclusion. Tu peux simplement commencer par le résumé.
            Dans l'idéal, le résumé doit permettre de comprendre de quel channel proviennent les messages et de quoi ils parlent.
            Lorsque tu cites un channel, tu dois le mettre en gras (exemple : "générale" devient "*générale*").
        `
        ,
        userPrompt:
        `
            Langue: Français
            Titre de l'utilisateur: ${title}
            
            Voici les messages non lus de Slack dans un format JSON :
            
            ${JSON.stringify(messages, null, 2)}
            
            Génère un résumé pour ${title} en tenant compte des priorités liées à son rôle.

        `,
    }
}