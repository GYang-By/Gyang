// 非表单不可用disAB，遮罩层防止重复点击
function preventEvent(page) {
  page.setData({ prevent: true });
  setTimeout(() => {
    page.setData({ prevent: false });
  }, 400);
  return true
}
module.exports = {
  preventEvent: preventEvent
}