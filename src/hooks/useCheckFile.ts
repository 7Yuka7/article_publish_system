// 用来验证上传文件的合法性
interface CheckCondition {
  format?: string[];
  size?: number
}
type ErrorType = 'size' | 'format' | null

const beforeUploadCheck = (file:File, condition:CheckCondition) => {
  const { format, size } = condition
  // 验证 -- 三目运算符，首先判断有无format，如果有在进行判断，如果没有直接返回true
  const isValidFormat = format ? format.includes(file.type) : true
  // 大小先转换成kb再转换成mb
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error:ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export default beforeUploadCheck
