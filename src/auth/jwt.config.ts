export default {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15m' },
};