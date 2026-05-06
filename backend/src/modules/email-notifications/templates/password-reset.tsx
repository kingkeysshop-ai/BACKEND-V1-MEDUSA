import * as React from 'react'
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
  Button, 
  Hr 
} from '@react-email/components'

export const PASSWORD_RESET = 'password-reset'

export interface PasswordResetTemplateProps {
  email: string
  resetUrl: string
  expiresInMinutes?: number
  preview?: string
}

export const isPasswordResetData = (data: any): data is PasswordResetTemplateProps =>
  typeof data === 'object' &&
  data !== null &&
  typeof data.email === 'string' &&
  typeof data.resetUrl === 'string'

export const PasswordResetEmail: React.FC<PasswordResetTemplateProps> & { PreviewProps?: PasswordResetTemplateProps } = ({
  email,
  resetUrl,
  expiresInMinutes = 60,
  preview = 'Recuperá tu contraseña',
}) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Recuperá tu contraseña</Heading>

          <Text style={text}>Hola,</Text>

          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de la cuenta asociada a{' '}
            <strong>{email}</strong>. Hacé click en el botón de abajo para crear una nueva contraseña:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Restablecer contraseña
            </Button>
          </Section>

          <Text style={text}>O copiá y pegá este link en tu navegador:</Text>
          <Text style={linkText}>{resetUrl}</Text>

          <Hr style={hr} />

          <Text style={footer}>
            Este link expira en {expiresInMinutes} minutos. Si vos no solicitaste restablecer tu contraseña, ignorá este email, tu cuenta sigue segura.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

PasswordResetEmail.PreviewProps = {
  email: 'cliente@ejemplo.com',
  resetUrl: 'https://tutienda.com/reset-password?token=abc123',
  expiresInMinutes: 60,
  preview: 'Recuperá tu contraseña',
}

export default PasswordResetEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  borderRadius: '8px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 20px',
}

const text = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const linkText = {
  color: '#2563eb',
  fontSize: '13px',
  wordBreak: 'break-all' as const,
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '32px 0',
}

const footer = {
  color: '#888888',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
}