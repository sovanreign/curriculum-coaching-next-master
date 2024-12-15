import Image from 'next/image';

export default function SignInImageSection() {
    return (
        <div className="lg:flex lg:flex-col flex-1 justify-center items-center gap-8 hidden py-8 lg:w-96">
            <div className='top-1 absolute flex flex-col justify-center items-center lg:gap-2 py-4'>
                <span className='font-regular text-[16px]'>Curriculum Advising Management System</span>
                <Image
                    src="/unc-logo.png"
                    width={80}
                    height={80}
                    alt="Your Company"

                />
            </div>
            <Image
                src="/curriculum-logo.png"
                width={320}
                height={320}
                alt="Your Company"
                priority={true}

            />
        </div>
    );
}