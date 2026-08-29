'use client';
 

import React from 'react';
import { PortalLayout, Button, Badge } from '@eduverse/ui';
import { mockApprovals } from '../../../services/parentData';

export default function ParentApprovalsPage() {
  const [approvals, setApprovals] = React.useState(mockApprovals);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    setSelectedId(null);
  };

  const selectedApproval = approvals.find((a) => a.id === selectedId);

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Student Permission Forms & Approvals"
      pageDescription="Verify and approve field trip consent forms and safety agreements."
    >
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Approvals Lists */}
        <div className="lg:col-span-2 flex flex-col gap-4 select-none">
          {approvals.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className={`p-4 border rounded-xl flex justify-between items-center transition-all cursor-pointer ${
                selectedId === a.id ? 'bg-muted/10 border-primary/40' : 'bg-card border-border/60 hover:border-primary/20'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-card-foreground font-heading">{a.title}</h4>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">{a.childName} • {a.date}</span>
              </div>
              <Badge variant={a.status === 'PENDING' ? 'warning' : a.status === 'APPROVED' ? 'success' : 'error'}>
                {a.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1 p-5 bg-card border border-border/60 rounded-xl select-none">
          {selectedApproval ? (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-card-foreground font-heading">{selectedApproval.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{selectedApproval.description}</p>
              </div>

              {selectedApproval.status === 'PENDING' ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                  <div className="h-20 border border-dashed border-border/60 rounded flex items-center justify-center text-[10px] text-muted-foreground">
                    Digital Signature Placement
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleAction(selectedApproval.id, 'APPROVED')}
                      className="flex-1 text-xs h-9 font-heading"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(selectedApproval.id, 'REJECTED')}
                      className="flex-1 text-xs h-9 text-destructive border-destructive/30 hover:bg-destructive/10 font-bold"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                  Consent status processed: <strong>{selectedApproval.status}</strong>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Select a consent form to sign.</span>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
