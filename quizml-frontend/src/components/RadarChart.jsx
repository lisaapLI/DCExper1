import {
  RadarChart as ReRadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts'

export default function MateriRadarChart({ scores }) {
  const data = Object.entries(scores).map(([materi, skor]) => ({
    materi: materi === 'Aplikasi Turunan' ? 'APP.TRN'
          : materi === 'Teknik Integrasi' ? 'TEK.INT'
          : materi === 'Integral Lipat'   ? 'INT.LPT'
          : materi.toUpperCase(),
    fullMateri: materi,
    skor: Math.round(skor),
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#3e4946" strokeDasharray="2 2" />
        <PolarAngleAxis
          dataKey="materi"
          tick={{ fill: '#bdc9c5', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={30} domain={[0, 100]}
          tick={{ fill: '#3e4946', fontSize: 9 }}
          axisLine={false}
        />
        <Radar
          name="Skor"
          dataKey="skor"
          stroke="#b4ffec"
          fill="#b4ffec"
          fillOpacity={0.4}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: '#201f1f',
            border: '2px solid #000',
            borderRadius: 0,
            color: '#e5e2e1',
            fontSize: 12,
            fontFamily: 'JetBrains Mono',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          }}
          formatter={(v, n, p) => [`${v}%`, p.payload.fullMateri]}
          labelFormatter={() => ''}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
