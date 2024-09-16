export const colors = {
    grayText: '#858585',
    blueText: '#8696BB',
    darkText: '#0D1B34',
};

export const standardInput = 'h-12 w-full shadow-xl rounded-xl bg-gray-100 mb-9 p-2'

export const standardFormDescriptionText = `text-lg text-[${colors.grayText}] pl-3.5 mb-2`

export const standardSubtitleLogin = `text-base text-[${colors.blueText}] mt-3.5 text-center`

export const standardTextTitle = `mb-3.5 text-[${colors.darkText}]] text-2xl`

export const standardTextTitleBold = `mb-3.5 text-[${colors.darkText}]] text-2xl font-bold`

export const iconContainerClasses = (isActive: boolean) => 
    `p-2.5 rounded-2xl items-center justify-center relative ${isActive ? 'bg-sky-50' : ''}`

export const standardSizeIcon = 30

export const logoSizeIcon = 115