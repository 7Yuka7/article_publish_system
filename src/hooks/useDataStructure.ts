// 该组件用来对store中的数据格式进行转换
// 接收一个泛型 - 将数组转换成obj

export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => { // 该泛型需要有一个泛型约束
  return arr.reduce((prev, current) => { // 调用数组的reduce方法
    if (current._id) {
      prev[current._id] = current // 在对象上添加属性
    }
    return prev
  }, {} as { [key: string]: T }) // 对初始值进行类型断言 断言成可检索的OBJ
}
// eg: [{_id: '1', name: 'xxx'}] --> { 1:{_id: '1', name: 'xxx'} } 即整个对象外部有了一个数字的索引

// 将obj转换成数组
export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key]) // 取出obj中所有的key，返回一个数组，然后调用数组的map方法,返回的是obj中对应key的value --> 就把外部的索引变成了数组内部的一个index
}
// eg: { 1:{_id: '1', name: 'xxx'} } --> [ {_id: '1', name: 'xxx'} ] //索引为0
