import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

interface SocialProps{
  className?: string
}

const SocialLinks = ({className}: SocialProps) => {
  return (
    <div className='flex items-center gap-3'>
        <Link href='/#'>
        <FaLinkedin className={cn(className)} />
        </Link>
        <Link href='/#'>
        <FaSquareXTwitter className={cn(className)}  />
        </Link>
        <a href="/#">
        <MdEmail className={cn(className)}  />
        </a>
    </div>
  )
}

export default SocialLinks