module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://suitmedia-backend.suitdev.com/api/:path*',
            },
        ];
    },
};