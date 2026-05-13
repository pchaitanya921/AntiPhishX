import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../config/permissions';
import { canAccessResource, PLANS, hasPlanAccess } from '../../config/plans';
import { LockedFeature } from '../ui';

const PermissionWrapper = ({ 
    permission, 
    requiredPlan,
    requiredTopic,
    requiredLevel,
    hideInsteadOfDisable = false, 
    fallbackMessage,
    children,
    className = "",
    showLocked = true
}) => {
    const { user } = useAuth();
    
    // Internal Roles Bypass (superAdmin, enterpriseAdmin, internalTester)
    const isInternalRole = user && ['superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user.role);

    // Permission Check (RBAC)
    // If no permission is required, default to true. Otherwise check role permissions.
    const isPermitted = isInternalRole || !permission || (user && hasPermission(user.role, permission));
    
    // Unified Plan & Topic & Level Check (PBAC)
    // If we only have requiredPlan, we use that. If we have topic/level, we use those.
    let hasPlan = true;
    if (requiredTopic || requiredLevel) {
        hasPlan = isInternalRole || canAccessResource(user, requiredLevel, requiredTopic);
    } else if (requiredPlan) {
        // Fallback for simple plan checks
        const effectiveUserPlan = user?.subscriptionStatus === 'expired' ? PLANS.CORE : user?.currentPlan;
        hasPlan = isInternalRole || (user && hasPlanAccess(effectiveUserPlan, requiredPlan));
    }

    if (!isPermitted) {
        return hideInsteadOfDisable ? null : (
            <div className={`relative group ${className}`}>
                <div className="opacity-40 pointer-events-none select-none grayscale">
                    {children}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-not-allowed">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300 px-4 text-center">
                        Permission Required
                    </span>
                </div>
            </div>
        );
    }

    if (!hasPlan) {
        if (hideInsteadOfDisable) return null;
        if (showLocked) {
            // Determine what to show in the locked message
            const displayPlan = requiredTopic ? 'NEURAL ADVANCED' : (requiredPlan || 'PREMIUM');
            return <LockedFeature requiredPlan={displayPlan} message={fallbackMessage} />;
        }
    }

    return <>{children}</>;
};

export default PermissionWrapper;

