import React from 'react'
import Button from '../common/Button'
import { toast } from '../common/Toast'

export default function SocialAuth({ mode = 'login' }) {
  const handleSocialAuth = (provider) => {
    toast.info(`${provider} authentication coming soon!`)
  }

  const buttonText = mode === 'login' ? 'Sign in with' : 'Sign up with'

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('Google')}
          className="w-full flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{buttonText} Google</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialAuth('Facebook')}
          className="w-full flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>{buttonText} Facebook</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialAuth('Apple')}
          className="w-full flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.56.37 4.703.644 3.967 1.007c-.74.364-1.379.85-2.009 1.48C1.329 3.117.843 3.756.48 4.496.116 5.231-.158 6.089-.32 7.318-.484 8.553-.528 8.924-.528 12.545s.044 3.992.207 5.227c.163 1.229.437 2.087.8 2.822.364.74.85 1.379 1.48 2.009.63.63 1.269 1.116 2.009 1.48.735.364 1.593.637 2.822.8 1.235.164 3.606.208 5.227.208s3.992-.044 5.227-.207c1.229-.163 2.087-.437 2.822-.8.74-.365 1.379-.85 2.009-1.48.63-.63 1.116-1.269 1.48-2.009.364-.735.637-1.593.8-2.822.164-1.235.208-3.606.208-5.227s-.044-3.992-.207-5.227c-.163-1.229-.437-2.087-.8-2.822-.365-.74-.85-1.379-1.48-2.009C20.883 1.329 20.244.843 19.504.48 18.769.116 17.911-.158 16.682-.32 15.447-.484 15.076-.528 12.017-.528zm0 2.17c3.557 0 3.98.044 5.38.207 1.298.059 2.003.277 2.473.46.621.242 1.065.532 1.532.998.466.467.756.911.998 1.532.183.47.401 1.175.46 2.473.163 1.4.207 1.823.207 5.38s-.044 3.98-.207 5.38c-.059 1.298-.277 2.003-.46 2.473-.242.621-.532 1.065-.998 1.532-.467.466-.911.756-1.532.998-.47.183-1.175.401-2.473.46-1.4.163-1.823.207-5.38.207s-3.98-.044-5.38-.207c-1.298-.059-2.003-.277-2.473-.46-.621-.242-1.065-.532-1.532-.998-.466-.467-.756-.911-.998-1.532-.183-.47-.401-1.175-.46-2.473-.163-1.4-.207-1.823-.207-5.38s.044-3.98.207-5.38c.059-1.298.277-2.003.46-2.473.242-.621.532-1.065.998-1.532.467-.466.911-.756 1.532-.998.47-.183 1.175-.401 2.473-.46 1.4-.163 1.823-.207 5.38-.207z" />
            <path d="M12.017 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
            <circle cx="18.406" cy="5.594" r="1.44" />
          </svg>
          <span>{buttonText} Apple</span>
        </Button>
      </div>
    </div>
  )
}