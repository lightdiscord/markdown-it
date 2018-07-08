import escape from 'escape-string-regexp'

const TYPES = {
    Comment: Symbol('Comment'),
    Regular: Symbol('Regular'),
    from: (line, match) => isComment(line, match) ? TYPES.Comment : TYPES.Regular
}

const commentRegExp = match => match instanceof RegExp 
    ? match 
    : new RegExp(`^${escape(match)}`)

const isValid = line => !!line.trim()

const isComment = (line, match) => isValid(line) 
    && commentRegExp(match).test(line.trim())

const gather = (lines, match) => {
    const last = array => array[array.length - 1] || {}
    const type = line => TYPES.from(line, match)

    return lines.reduce((groups, line) => last(groups).type === type(line)
        ? last(groups).lines.push(line) && groups
        : [...groups, { type: type(line), lines: [line] }], [])
}

export { TYPES, commentRegExp, isValid, isComment, gather }