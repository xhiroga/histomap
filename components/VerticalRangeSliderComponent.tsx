import * as React from 'react';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// スライダーの値ラベル表示用のコンポーネント
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="left" title={value}>
      {children}
    </Tooltip>
  );
}

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

const VerticalRangeSliderComponent = () => {
  const [value, setValue] = React.useState<number[]>([25, 75]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Box sx={{ width: 32, height: '90vh', marginRight: '10px' }}>
      <GreenSlider
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical range slider"
        valueLabelDisplay="on"
        components={{
          ValueLabel: ValueLabelComponent,
        }}
        min={0}
        max={100}
      />
    </Box>
  );
}

export default VerticalRangeSliderComponent;