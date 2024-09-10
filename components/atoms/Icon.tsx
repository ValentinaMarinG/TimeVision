import { Image } from 'react-native';

type IconLogo ={
    size: number,
    source:any
}

export const MainIcon = ({size, source}:IconLogo)=> (
      <Image
        style={{ width: size, height: size }}
        source={source}
        />
)