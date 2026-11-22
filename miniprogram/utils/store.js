var GOALS = 'cs_mp_goals_v1';
var REM = 'cs_mp_reminders_v1';
var TODOS = 'cs_mp_todos_v1';
function read(key){
  try { return wx.getStorageSync(key) || []; } catch (e) { return []; }
}
function write(key, value){
  try { wx.setStorageSync(key, value); } catch (e) {}
}
function getGoals(){ return read(GOALS); }
function isGoal(itemId){
  return getGoals().some(function(g){ return g.itemId === itemId; });
}
function addGoal(item){
  var list = getGoals();
  if (list.some(function(g){ return g.itemId === item.id; })) return false;
  list.push({
    id: 'g' + Date.now(),
    itemId: item.id,
    itemName: item.name,
    type: item.type,
    level: item.level,
    createdAt: Date.now()
  });
  write(GOALS, list);
  return true;
}
function removeGoal(itemId){
  write(GOALS, getGoals().filter(function(g){ return g.itemId !== itemId; }));
}
function getReminders(){ return read(REM); }
function saveReminder(reminder){
  var list = getReminders();
  var index = list.findIndex(function(r){ return r.itemId === reminder.itemId && r.kind === reminder.kind; });
  if (index >= 0) {
    list[index] = Object.assign({}, list[index], reminder, { id: list[index].id });
  } else {
    list.push(reminder);
  }
  write(REM, list);
  return reminder;
}
function updateReminder(id, patch){
  var list = getReminders().map(function(r){ return r.id === id ? Object.assign({}, r, patch) : r; });
  write(REM, list);
}
function removeReminder(id){
  write(REM, getReminders().filter(function(r){ return r.id !== id; }));
}
function getTodos(){ return read(TODOS); }
function addTodo(text){
  var list = getTodos();
  var todo = { id: 't' + Date.now(), text: text, createdAt: Date.now() };
  list.unshift(todo);
  write(TODOS, list);
  return todo;
}
function removeTodo(id){
  write(TODOS, getTodos().filter(function (t) { return t.id !== id; }));
}
function clearAll(){
  try { wx.removeStorageSync(GOALS); wx.removeStorageSync(REM); } catch (e) {}
}
module.exports = {
  getGoals: getGoals,
  isGoal: isGoal,
  addGoal: addGoal,
  removeGoal: removeGoal,
  getTodos: getTodos,
  addTodo: addTodo,
  removeTodo: removeTodo,
  getReminders: getReminders,
  saveReminder: saveReminder,
  updateReminder: updateReminder,
  removeReminder: removeReminder,
  clearAll: clearAll
};