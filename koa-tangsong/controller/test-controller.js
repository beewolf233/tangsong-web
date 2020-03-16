const hello = async (ctx, next) => {
    ctx.body = 'hello world';
    ctx.status = 200;
}

module.exports = {
    'test/hello': hello
}