import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirma tu cuenta en QueTeRegalo',
      text: `Confirma tu cuenta visitando este enlace:  http://localhost:3000/api/auth/confirm-acount/${token}`,
    })
  }

  async sendPasswordResetEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recupera tu contraseña en QueTeRegalo',
      text: `Restablece tu contraseña aquí: http://localhost:3000/api/auth/reset-password/${token}`,
    })
  }
}