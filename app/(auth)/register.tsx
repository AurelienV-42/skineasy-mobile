import assets from '@assets'
import { Step1Name } from '@features/auth/components/onboarding/Step1Name'
import { Step2AboutYou } from '@features/auth/components/onboarding/Step2AboutYou'
import { Step3Credentials } from '@features/auth/components/onboarding/Step3Credentials'
import { useRegister } from '@features/auth/hooks/useRegister'
import {
  RegisterInput,
  registerSchema,
  step1Schema,
  step2Schema,
} from '@features/auth/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { colors } from '@theme/colors'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image, View } from 'react-native'
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pressable } from '../../src/shared/components/Pressable'

const TOTAL_STEPS = 3

export default function RegisterScreen() {
  const router = useRouter()
  const { mutate: register, isPending } = useRegister()
  const [currentStep, setCurrentStep] = useState(1)

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<RegisterInput>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      id_gender: 2, // Female default
      birthday: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const validateStep = async (step: number): Promise<boolean> => {
    const values = getValues()

    if (step === 1) {
      const result = step1Schema.safeParse({
        firstname: values.firstname,
        lastname: values.lastname,
      })
      if (!result.success) {
        await trigger(['firstname', 'lastname'])
        return false
      }
      return true
    }

    if (step === 2) {
      const result = step2Schema.safeParse({
        id_gender: values.id_gender,
        birthday: values.birthday,
      })
      if (!result.success) {
        await trigger(['id_gender', 'birthday'])
        return false
      }
      return true
    }

    return true
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      router.back()
    }
  }

  const onSubmit = (data: RegisterInput) => {
    register(data)
  }

  const isStep1Valid = getValues('firstname')?.length >= 2 && getValues('lastname')?.length >= 2

  const isStep2Valid = getValues('id_gender') >= 1 && getValues('id_gender') <= 3

  const isStep3Valid =
    getValues('email')?.length > 0 &&
    getValues('password')?.length >= 6 &&
    getValues('confirmPassword')?.length >= 6 &&
    getValues('password') === getValues('confirmPassword')

  return (
    <View className="flex-1 bg-background">
      {/* Bubble Header */}
      <Image
        source={assets.bubbleHeader}
        className="absolute top-0 left-0 right-0 w-full"
        resizeMode="contain"
      />

      <SafeAreaView className="flex-1">
        {/* Progress Bar */}
        <View className="px-6 pt-4 pb-2">
          <Pressable
            onPress={handleBack}
            haptic="light"
            className="w-10 h-10 rounded-full"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* Step Content */}
        <View className="flex-1">
          {currentStep === 1 && (
            <Animated.View
              key="step1"
              entering={FadeInRight.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              className="flex-1"
            >
              <Step1Name
                onNext={handleNext}
                control={control}
                errors={errors}
                isValid={isStep1Valid}
              />
            </Animated.View>
          )}

          {currentStep === 2 && (
            <Animated.View
              key="step2"
              entering={FadeInRight.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              className="flex-1"
            >
              <Step2AboutYou
                onNext={handleNext}
                control={control}
                errors={errors}
                isValid={isStep2Valid}
              />
            </Animated.View>
          )}

          {currentStep === 3 && (
            <Animated.View
              key="step3"
              entering={FadeInRight.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              className="flex-1"
            >
              <Step3Credentials
                onNext={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                isValid={isStep3Valid}
                isLoading={isPending}
              />
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}
