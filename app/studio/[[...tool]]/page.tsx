'use client'

/**
 * Sanity Studio embedded at /studio
 * Staff log in here to manage the menu and publish the daily lunch menu.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
