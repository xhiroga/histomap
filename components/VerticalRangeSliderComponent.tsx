import { Mark } from '@mui/base/useSlider';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

// Verticalなスライダーの場合デフォルトで右側にMarksが表示されるが、スマホで見たときにスペースを取りすぎるので表示しない（labelを設定しない）
const valuesToMarks = (values: number[]): Mark[] => values.map((value) => ({ value }))

// スタイリングしたスライダーコンポーネント
const GreenSlider = styled(Slider)(({ theme }) => ({
  color: '#52af77',
  height: 400, // 高さを調整
  width: 2, // 幅を調整
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

interface VerticalRangeSliderComponentProps {
  range: number[]; // [start, end]
  setRange: (range: number[]) => void;
  values: number[];
  min: number;
  max: number;
}

const VerticalRangeSliderComponent = ({ range, setRange, values, min, max }: VerticalRangeSliderComponentProps) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };
  const valueLabelFormat = (value: number) => new Date(value).toISOString().split('T')[0];

  return (
    <GreenSlider
      getAriaLabel={() => "表示する年代を選択"}
      marks={valuesToMarks(values)}
      max={max}
      min={min}
      onChange={handleChange}
      orientation="vertical"
      step={null}
      value={range}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
    />
  );
}

export default VerticalRangeSliderComponent;