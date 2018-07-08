import cli from 'command-line-args'
import stdin from 'get-stdin'
import { TYPES, gather, commentRegExp } from '../lib/lines'

const { language = "", comment } = cli([
    { name: 'comment', alias: 'c', type: String },
    { name: 'language', alias: 'l', type: String }
])

if (!comment) throw new Error('Flag comment not defined')

const format = {
    [TYPES.Comment]: lines => lines.map(line => line.trim().replace(commentRegExp(comment), '').trim()),
    [TYPES.Regular]: lines => `${'```'}${language}\n${lines.join('\n')}${'```'}`
}

stdin().then(text => {
    const groups = gather(text.split('\n'), comment)
    const result = groups.map(group => format[group.type](group.lines))

    console.log(result.join`\n`)
})