// Original vector animation: a sunlit landscape with a floating destination pin.
const color = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).concat(1)
const fill = hex => ({ ty: 'fl', c: { a: 0, k: color(hex) }, o: { a: 0, k: 100 }, r: 1 })
const ellipse = (x, y, w, h) => ({ ty: 'el', p: { a: 0, k: [x, y] }, s: { a: 0, k: [w, h] } })
const polygon = points => ({ ty: 'sh', ks: { a: 0, k: { i: points.map(() => [0, 0]), o: points.map(() => [0, 0]), v: points, c: true } } })
const frames = (start, end) => ({ a: 1, k: [
  { t: 0, s: start, e: end, i: { x: .65, y: 1 }, o: { x: .35, y: 0 } },
  { t: 75, s: end, e: start, i: { x: .65, y: 1 }, o: { x: .35, y: 0 } },
  { t: 150, s: start },
] })
const layer = (name, shapes, motion = {}) => ({
  ty: 4, nm: name, ind: name.length, sr: 1, ip: 0, op: 150, st: 0,
  ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }, ...motion }, shapes,
})
export default {
  v: '5.12.2', fr: 30, ip: 0, op: 150, w: 480, h: 380, nm: 'Trieo scenic escape', ddd: 0, assets: [],
  layers: [
    layer('Pin center', [ellipse(308, 149, 18, 18), fill('#f8edca')], { p: frames([0, 0, 0], [0, -12, 0]) }),
    layer('Destination pin', [ellipse(308, 150, 54, 54), polygon([[286, 166], [308, 204], [330, 166]]), fill('#e4b75d')], { p: frames([0, 0, 0], [0, -12, 0]) }),
    layer('Pin shadow', [ellipse(308, 283, 48, 8), fill('#94b5a3')], { s: frames([100, 100, 100], [95, 100, 100]) }),
    layer('River', [polygon([[223, 210], [240, 210], [228, 234], [259, 246], [227, 266], [277, 285], [204, 285], [187, 263], [228, 244], [212, 231]]), fill('#91c5b8')]),
    layer('Front hills', [polygon([[45, 285], [100, 203], [156, 254], [223, 195], [294, 258], [360, 222], [432, 285]]), fill('#39785c')]),
    layer('Back hills', [polygon([[47, 275], [146, 137], [189, 203], [247, 165], [327, 246], [370, 184], [436, 275]]), fill('#7ba18a')]),
    layer('Snow cap', [polygon([[121, 171], [146, 137], [169, 171], [150, 164], [140, 174]]), fill('#eef3df')]),
    layer('Cloud right', [ellipse(356, 101, 75, 15), ellipse(344, 95, 30, 24), fill('#f2f3dd')], { p: frames([0, 0, 0], [15, 0, 0]) }),
    layer('Cloud left', [ellipse(117, 107, 67, 15), ellipse(112, 98, 33, 27), fill('#f2f3dd')], { p: frames([0, 0, 0], [-15, 0, 0]) }),
    layer('Sun', [ellipse(252, 111, 76, 76), fill('#edc979')], { p: frames([0, 0, 0], [0, -6, 0]) }),
    layer('Scenic backdrop', [ellipse(240, 187, 335, 290), fill('#dce8d4')]),
  ],
}
