'use client'

import { useState, useEffect } from 'react'
import { Ticket } from 'lucide-react'

interface PromoCodeInputProps {
  cartId: string | null
  onPromoApplied: () => void
}

export default function PromoCodeInput({ cartId, onPromoApplied }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !cartId) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`http://localhost:3000/api/v1/carts/${cartId}/apply_promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promo_code: promoCode.toUpperCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setPromoCode('')
        onPromoApplied()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Failed to apply promo code' })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyPromo()
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-2">
        <Ticket className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">Have a promo code?</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter code (e.g. MACBOOK200)"
          disabled={!cartId || loading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm font-mono"
        />
        <button
          onClick={handleApplyPromo}
          disabled={!cartId || !promoCode.trim() || loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-600">
        Available codes: MACBOOK200, DELL15, MOUSE2FOR1, COFFEE50, ACCESSORIES10, PREMIUM30
      </div>
    </div>
  )
}
