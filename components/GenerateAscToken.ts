import {importPKCS8, SignJWT} from "jose";

const generateAscToken = async (issuerId: string, keyId: string, privateKey: string): Promise<string> => {
    const exp = Math.floor(Date.now() / 1000) + (20 * 60); // 20 minutes

    const payload = {
        iss: issuerId,
        iat: Math.floor(Date.now() / 1000),
        exp: exp,
        aud: "appstoreconnect-v1"
    };

    const alg = 'ES256';
    const privateKeyObj = await importPKCS8(privateKey, alg);

    const token = await new SignJWT(payload)
        .setProtectedHeader({alg, kid: keyId, typ: 'JWT'})
        .setIssuedAt()
        .setIssuer(issuerId)
        .setAudience('appstoreconnect-v1')
        .setExpirationTime('20m')
        .sign(privateKeyObj);

    return token;
};

export default generateAscToken;