const nodemailer = require('nodemailer');

class EmailHelpers {
    // ✅ Reusable transporter factory
    static createTransporter() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,          // smtp.gmail.com
            port: process.env.SMTP_PORT,          // 587
            secure: process.env.SMTP_SECURE === 'true', // false for 587 (TLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    static async sendMail({ to, subject, text, html }) {
        const transporter = this.createTransporter();

        await transporter.sendMail({
            from: `"Fitness Buddy 👟" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });
    }

    static async sendWelcomeEmail(email, name) {
        try {
            const transporter = this.createTransporter();

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Welcome to FitnessBuddy!',
                html: `
                    <h1>Welcome to FitnessBuddy, ${name}!</h1>
                    <p>We're excited to have you join our fitness community.</p>
                    <p>Start by:</p>
                    <ul>
                        <li>Completing your profile</li>
                        <li>Setting your fitness goals</li>
                        <li>Finding your first workout buddy</li>
                    </ul>
                    <p>Happy exercising!</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully');
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }

    static async sendGoalReminderEmail(email, name, goalTitle) {
        try {
            const transporter = this.createTransporter();

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Goal Reminder - Don\'t Give Up!',
                html: `
                    <h1>Hi ${name}!</h1>
                    <p>This is a friendly reminder about your goal: <strong>${goalTitle}</strong></p>
                    <p>Keep pushing forward! Every small step counts.</p>
                    <p>Log into FitnessBuddy to track your progress and stay motivated.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Goal reminder email sent successfully');
        } catch (error) {
            console.error('Error sending goal reminder email:', error);
        }
    }

    static async sendWeeklyReport(email, name, reportData) {
        try {
            const transporter = this.createTransporter();

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Your Weekly Fitness Report',
                html: `
                    <h1>Weekly Report for ${name}</h1>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
                        <h2>This Week's Achievements</h2>
                        <p><strong>Total Workouts:</strong> ${reportData.totalWorkouts}</p>
                        <p><strong>Total Duration:</strong> ${reportData.totalDuration} minutes</p>
                        <p><strong>Calories Burned:</strong> ${reportData.totalCalories}</p>
                        <p><strong>Distance Covered:</strong> ${reportData.totalDistance} km</p>
                    </div>
                    <p>Keep up the great work! Next week, try to beat these numbers.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Weekly report email sent successfully');
        } catch (error) {
            console.error('Error sending weekly report email:', error);
        }
    }

    static async sendVerificationEmail({ email, name, otp }) {
        try {
            const transporter = this.createTransporter(); // ✅ fixed

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Verify Your FitnessBuddy Email',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Verify Your Email</h1>
                        <p>Hi ${name},</p>
                        <p>Welcome to FitnessBuddy! Please use the verification code below to verify your email address:</p>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <h2 style="color: #2ed573; font-size: 32px; margin: 0; letter-spacing: 3px;">${otp}</h2>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't create an account with FitnessBuddy, please ignore this email.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Verification email sent successfully');
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }

    static async sendPasswordResetEmail(email, name, otp) {
        try {
            const transporter = this.createTransporter();

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Reset Your FitnessBuddy Password',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Password Reset Request</h1>
                        <p>Hi ${name},</p>
                        <p>You requested to reset your password. Please use the code below to reset your password:</p>
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <h2 style="color: #ff4757; font-size: 32px; margin: 0; letter-spacing: 3px;">${otp}</h2>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }
}

module.exports = EmailHelpers;
