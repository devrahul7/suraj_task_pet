"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = void 0;
function buildTemplate(context) {
    const recipientName = context.name || "there";
    const actionLink = context.actionUrl && context.actionLabel
        ? `<p><a href="${context.actionUrl}" style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">${context.actionLabel}</a></p><p>${context.actionUrl}</p>`
        : "";
    return {
        subject: context.title,
        text: [
            `Hi ${recipientName},`,
            context.message,
            context.detail || "",
            context.actionUrl || "",
        ].filter(Boolean).join("\n\n"),
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <p>Hi ${recipientName},</p>
        <p>${context.message}</p>
        ${context.detail ? `<p>${context.detail}</p>` : ""}
        ${actionLink}
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
    };
}
exports.EmailTemplates = {
    booking(name, details, actionUrl) {
        return buildTemplate({
            name,
            title: "Your booking has been received",
            message: "We received your booking and it is currently being processed.",
            detail: details,
            actionUrl,
            actionLabel: "View booking",
        });
    },
    approval(name, details, actionUrl) {
        return buildTemplate({
            name,
            title: "Your request has been approved",
            message: "Your request has been approved.",
            detail: details,
            actionUrl,
            actionLabel: "View details",
        });
    },
    cancellation(name, details, actionUrl) {
        return buildTemplate({
            name,
            title: "Your request has been cancelled",
            message: "A request associated with your account has been cancelled.",
            detail: details,
            actionUrl,
            actionLabel: "View details",
        });
    },
    completion(name, details, actionUrl) {
        return buildTemplate({
            name,
            title: "Your request has been completed",
            message: "The request associated with your account has been marked as completed.",
            detail: details,
            actionUrl,
            actionLabel: "View details",
        });
    },
    resetPassword(name, actionUrl) {
        return buildTemplate({
            name,
            title: "Reset your PetEy password",
            message: "Use the link below to reset your password.",
            actionUrl,
            actionLabel: "Reset password",
        });
    },
};
