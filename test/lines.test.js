import test from 'ava'
import * as lines from '../lib/lines'

const text = `
    Hello world!
    It's time to....
    -- This some kind of lua comment
    
    Markdown it!
    -- Another lua comment
`.split('\n')

const comment = lines.commentRegExp('--')

test('number of empty line', t => {
    const message = text.filter(lines.isValid)

    t.is(message.length, 5)
})

test('number of comment', t => {
    const message = text.filter(line => lines.isComment(line, comment))

    t.is(message.length, 2)
})

test('is a regular line', t => {
    const line = 'echo "Hello world!"'

    t.is(lines.TYPES.from(line, '#'), lines.TYPES.Regular)
})

test('is a comment line', t => {
    const line = '# echo "Hello world!"'

    t.is(lines.TYPES.from(line, '#'), lines.TYPES.Comment)
})

test('gather in groups', t => {
    const groups = lines.gather(text, comment)
    const iterator = groups[Symbol.iterator]()

    t.is(iterator.next().value.type, lines.TYPES.Regular)
    t.is(iterator.next().value.type, lines.TYPES.Comment)
    t.is(iterator.next().value.type, lines.TYPES.Regular)
    t.is(iterator.next().value.type, lines.TYPES.Comment)
})