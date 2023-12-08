type MapleLeafProps = {
  fill?: string
  size?: number
  className?: string
}
export default function MapleLeaf({
  fill = "#b91c1c",
  size = 32,
  className,
}: MapleLeafProps) {
  return (
    <svg
      className={className}
      fill={fill}
      height={size}
      width={size}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            d="M508.972,292.006l-32.503-27.392l34.517-64.452c1.417-2.645,1.348-5.837-0.196-8.414
			c-1.544-2.569-4.318-4.147-7.322-4.147h-69.871l-8.789-42.044c-0.597-2.825-2.577-5.163-5.265-6.204
			c-2.679-1.041-5.717-0.657-8.073,1.024l-73.421,52.77l11.784-132.796c0.265-2.953-1.032-5.828-3.405-7.595
			c-2.381-1.775-5.513-2.176-8.269-1.084l-36.036,14.421L263.237,3.878c-3.123-4.992-11.349-4.992-14.473,0l-38.886,62.216
			l-36.036-14.421c-2.756-1.092-5.879-0.691-8.269,1.084c-2.381,1.766-3.669,4.642-3.405,7.595l11.785,132.796l-73.429-52.779
			c-2.347-1.681-5.376-2.057-8.073-1.024c-2.688,1.05-4.668,3.388-5.265,6.212l-8.781,42.044H8.534
			c-3.004,0-5.777,1.579-7.322,4.147c-1.545,2.577-1.613,5.769-0.196,8.414l34.517,64.461L3.03,292.006
			c-2.244,1.903-3.362,4.813-2.944,7.731c0.418,2.91,2.295,5.402,4.983,6.596l147.046,65.357l-15.326,61.303
			c-0.751,2.987,0.171,6.144,2.406,8.269c2.236,2.116,5.436,2.859,8.38,1.963l99.891-30.746v90.854c0,4.71,3.823,8.533,8.533,8.533
			s8.533-3.823,8.533-8.533V337.617L378.497,271.8c4.087-2.355,5.487-7.578,3.132-11.657c-2.372-4.079-7.586-5.487-11.665-3.123
			l-105.429,60.877V127.868c0-4.71-3.823-8.533-8.533-8.533s-8.533,3.823-8.533,8.533v190.02l-105.446-60.885
			c-4.096-2.364-9.301-0.956-11.665,3.123c-2.355,4.088-0.947,9.301,3.132,11.665l113.98,65.801v57.045l-90.453,27.827
			l13.397-53.589c1.007-4.028-1.024-8.183-4.813-9.873L24.458,296.273l27.358-23.057c3.089-2.603,3.925-7.006,2.022-10.556
			l-31.053-57.993h62.549c4.045,0,7.526-2.833,8.354-6.784l7.526-36.002l77.901,56.004c2.714,1.954,6.315,2.142,9.207,0.478
			c2.901-1.647,4.574-4.838,4.275-8.166L180.396,72.683l29.764,11.913c3.84,1.536,8.218,0.094,10.411-3.405l35.43-56.687
			l35.43,56.687c2.193,3.499,6.571,4.949,10.411,3.405l29.764-11.913l-12.203,137.515c-0.299,3.328,1.374,6.519,4.275,8.166
			c2.901,1.664,6.511,1.476,9.207-0.478l77.901-55.996l7.526,35.994c0.828,3.951,4.318,6.784,8.354,6.784h62.549l-31.053,57.984
			c-1.903,3.558-1.067,7.953,2.022,10.556l27.358,23.066l-141.141,62.729c-3.789,1.69-5.82,5.845-4.813,9.873l13.397,53.589
			l-62.37-19.183c-4.497-1.408-9.276,1.135-10.658,5.641c-1.391,4.506,1.143,9.284,5.649,10.667l76.817,23.637
			c0.828,0.247,1.673,0.375,2.509,0.375c2.15,0,4.258-0.819,5.871-2.338c2.236-2.125,3.157-5.282,2.406-8.269l-15.326-61.303
			l147.046-65.357c2.688-1.195,4.565-3.686,4.983-6.596C512.334,296.819,511.216,293.909,508.972,292.006z"
          />
        </g>
      </g>
    </svg>
  )
}