import { createHash } from 'crypto'

export function verifBody(body, proto): boolean {
    for (var i in proto) {
        if (!body.hasOwnProperty(i) || typeof body[i] !== proto[i])
            return false;
    }
    return true;
}

export async function hashPassword(password: string): Promise<string> {
    return (await createHash('sha256').update(password).digest('base64'))
}

export function randomMail() {
    let text : string = "";
    const possible : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return (text + '@hypertube.fr');
}
